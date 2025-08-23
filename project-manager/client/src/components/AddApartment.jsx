import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast"
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios"

const PORT = import.meta.env.VITE_PORT;


const AddApartment = ({ propertyId }) => {
  const [unit, setUnit] = useState("");
  const [rent, setRent] = useState(0);
  const [leaseStartDate, setLeaseStart] = useState("");
  const [leaseEndDate, setLeaseEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!unit.trim() || !rent.trim()) {
      toast.error("Unit and rent fields are required")
      return;
    }
    setLoading(true)
    try {
      await axios.post(`http://localhost:${PORT}/api/property/${propertyId}/apartment`, {
        unit,
        rent,
        leaseStartDate,
        leaseEndDate,
        notes
      })
      toast.success("Apartment successfully added")
      navigate(`/properties/${propertyId}`)
    }
    catch (error) {
      console.log("Error creating apartment",error)
      toast.error("Failed to add apartment!")
    } finally{
      setLoading(false)
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
                  ></input>
                </div>
                <div className="form-control mb-4">
                  <label className="label-text">
                    <span className="label-text">Rent</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Input Rent..."
                    className="input input-bordered"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                  ></input>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Lease Start Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lease Start Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={leaseStartDate}
                      onChange={(e) => setLeaseStart(e.target.value)}
                    />
                  </div>

                  {/* Lease End Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lease End Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={leaseEndDate}
                      onChange={(e) => setLeaseEnd(e.target.value)}
                      min={leaseStartDate}
                    />
                  </div>
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
                {/* Divider */}
                <div className="divider"></div>
                <div className ="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading} >
                  {loading ? "Creating..." :"Add Apartment"}
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
