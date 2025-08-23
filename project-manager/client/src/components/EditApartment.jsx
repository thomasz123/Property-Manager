import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";
import { formatDate } from "../lib/utils";

const PORT = import.meta.env.VITE_PORT;

const EditApartment = ({ propertyId, apartment, onSuccess }) => {
  const [unit, setUnit] = useState(apartment?.unit || "");
  const [rent, setRent] = useState(apartment?.rent || 0);
  const [leaseStartDate, setLeaseStart] = useState(
    apartment?.leaseStartDate || ""
  );
  const [leaseEndDate, setLeaseEnd] = useState(apartment?.leaseEndDate || "");
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
      unit: unit,
      rent: rent,
      leaseStartDate: leaseStartDate,
      leaseEndDate: leaseEndDate,
      notes: notes,
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
                      value={leaseStartDate.substring(0, 10)}
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
                      value={leaseEndDate.substring(0, 10)}
                      onChange={(e) => setLeaseEnd(e.target.value)}
                      min={leaseStartDate.substring(0, 10)}
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
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Modifying..." : "Edit Apartment"}
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
