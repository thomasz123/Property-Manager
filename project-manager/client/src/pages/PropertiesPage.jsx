import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import PropertyCard from "../components/PropertyCard";
import { PlusCircle } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PORT = import.meta.env.VITE_PORT;

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const axiosAuth = async (options) => {
    const token = await getToken();
    if (!token) throw new Error("No Firebase token found");
    return axios({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await axiosAuth({
          method: "get",
          url: `http://localhost:${PORT}/api/properties/`,
        });
        setProperties(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching properties", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load properties");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleDeleteProperty = async (propertyId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this property?")) return;
      const propertyToDelete = properties.find((prop) => prop._id === propertyId);
      await axiosAuth({ method: "delete", url: `http://localhost:${PORT}/api/properties/${propertyId}/` });

      setProperties((prevProperties) => prevProperties.filter((prop) => prop._id !== propertyId));
      toast.success(`Successfully deleted ${propertyToDelete.address}`);
    } catch (error) {
      console.error("Error deleting property", error);
      toast.error("Error deleting property");
    }
  };

  const handleEditProperty = async (propertyId, updatedFormData) => {
    try {
      const res = await axiosAuth({
        method: "put",
        url: `http://localhost:${PORT}/api/properties/${propertyId}`,
        data: updatedFormData,
      });
      setProperties((prev) =>
        prev.map((prop) => (prop._id === propertyId ? res.data : prop))
      );
      toast.success("Property successfully modified");
    } catch (error) {
      console.error("Error modifying property", error);
      toast.error("Failed to modify property!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex justify-between items-center mb-6 p-5">
        <h1 className="text-3xl font-bold">Properties:</h1>
        <Link to={"/addProperty"} className="btn btn-primary rounded-full">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto -p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">Loading Properties...</div>
        )}

        {!isLoading && properties.length === 0 && !isRateLimited && (
          <div className="text-center py-10 text-gray-500">No properties found.</div>
        )}

        {properties.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div className="p-5" key={property._id}>
                <PropertyCard
                  property={property}
                  deletePropertyCard={handleDeleteProperty}
                  editPropertyCard={handleEditProperty}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPage;
