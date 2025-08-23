import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";
import { formatDate } from "../lib/utils";

const PORT = import.meta.env.VITE_PORT;

const EditProperty = ({ property, onSuccess }) => {
  const [address, setAddress] = useState(property?.address || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error("Address field is required");
      return;
    }
    setLoading(true);
    await onSuccess({
      address: address,
    });
    setLoading(false);
  };
  return (
    <div className="bg-white">
      <div className="container mx-auto p-3">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Property</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label-text">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input Unit..."
                    className="input input-bordered"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></input>
                </div>
                {/* Divider */}
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Modifying..." : "Edit Property"}
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

export default EditProperty;
