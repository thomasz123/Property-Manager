import React, { useState } from "react";
import toast from "react-hot-toast";

const EditApartment = ({ apartment, onSuccess }) => {
  const [unit, setUnit] = useState(apartment?.unit || "");
  const [notes, setNotes] = useState(apartment?.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!unit.trim()) {
      toast.error("Unit field is required");
      return;
    }

    setLoading(true);
    await onSuccess({
      unit,
      notes,
    });
    setLoading(false);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto p-3">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Apartment</h2>
              <form onSubmit={handleSubmit}>
                {/* Unit */}
                <div className="form-control mb-4">
                  <label className="label">
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
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Additional information about this apartment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Apartment"}
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

export default EditApartment;
