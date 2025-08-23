import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import { useParams } from "react-router";
import ApartmentCard from "../components/ApartmentCard";
import { Link } from "react-router";
import AddApartment from "../components/AddApartment";
import { PlusCircle } from "lucide-react";

const PORT = import.meta.env.VITE_PORT;

const ApartmentPage = () => {
  const { propertyId } = useParams();
  const [apartments, setApartments] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:${PORT}/api/property/${propertyId}`
        );
        console.log(res.data);
        setApartments(res.data.apartments);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching apartments", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load apartments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex justify-between items-center mb-6 p-5">
        <h1 className="text-3xl font-bold">Apartments:</h1>
        <Link to={`/${propertyId}/addApartment`} className="btn btn-primary rounded-full">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Apartment
        </Link>
      </div>
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto -p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">
            Loading Apartments
          </div>
        )}
        {apartments.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <div className="p-5" key={apartment._id}>
                <ApartmentCard propertyId={propertyId} apartment={apartment} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ApartmentPage;
