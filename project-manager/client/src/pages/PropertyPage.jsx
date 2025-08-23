import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import PropertyCard from "../components/PropertyCard";

const PORT = import.meta.env.VITE_PORT;

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`http://localhost:${PORT}/api/property/`);
        console.log(res.data);
        setProperties(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching properties", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load apartments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto -p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">
            Loading Properties
          </div>
        )}
        {properties.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div className="p-5" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PropertyPage;
