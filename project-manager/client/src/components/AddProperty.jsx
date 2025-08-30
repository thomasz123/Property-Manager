import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";
import { auth } from "../firebase/firebase"; // Import Firebase auth

const PORT = import.meta.env.VITE_PORT;

const AddProperty = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error("Address field is required");
      return;
    }

    setLoading(true);
    try {
      // Get current user's Firebase ID token
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `http://localhost:${PORT}/api/properties/`,
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach token for backend verification
          },
        }
      );

      toast.success("Property successfully added");
      navigate("/");
    } catch (error) {
      console.log("Error creating property", error);
      toast.error("Failed to add property!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Properties
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Property</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label-text">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input Address..."
                    className="input input-bordered"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></input>
                </div>

                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Add Property"}
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

export default AddProperty;
