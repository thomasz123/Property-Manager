import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";

const PORT = import.meta.env.VITE_PORT;

const AddApartment = ({ propertyId }) => {
  const [unit, setUnit] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!unit.trim()) {
      toast.error("Unit field is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:${PORT}/api/properties/${propertyId}/apartments`,
        {
          unit,
          notes,
        }
      );

      toast.success("Apartment successfully added");
      navigate(`/properties/${propertyId}`);
    } catch (error) {
      console.error("Error creating apartment", error);
      toast.error("Failed to add apartment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={`/properties/${propertyId}`} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Apartments
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Apartment</h2>
              <form onSubmit={handleSubmit}>
                {/* Unit */}
                <div className="form-control mb-4">
                  <label className="label-text">
                    <span className="label-text">Unit</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input Unit..."
                    className="input input-bordered"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Notes</span>
                    <span className="label-text">Optional</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Additional information about this apartment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Submit */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Add Apartment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddApartment;
