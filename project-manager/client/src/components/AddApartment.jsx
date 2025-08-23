import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

const AddApartment = ({ propertyId }) => {
  const [unit, setUnit] = useState("");
  const [rent, setRent] = useState(0);
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};
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
