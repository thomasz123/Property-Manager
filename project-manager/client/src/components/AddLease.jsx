import React, { useState } from "react";
import { formatDate } from "../lib/utils";

const AddLease = ({ onSuccess }) => {
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [rent, setRent] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [leaseType, setLeaseType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSuccess({
        leaseStartDate,
        leaseEndDate,
        rent: parseFloat(rent),
        securityDeposit: parseFloat(securityDeposit),
        leaseType,
      });
    } catch (err) {
      console.error("Error adding lease", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto p-3">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Add Lease</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Lease Start Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={leaseStartDate}
                    onChange={(e) => setLeaseStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Lease End Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={leaseEndDate}
                    onChange={(e) => setLeaseEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Rent</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Security Deposit</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Lease Type</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={leaseType}
                    onChange={(e) => setLeaseType(e.target.value)}
                  />
                </div>
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Add Lease"}
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

export default AddLease;
