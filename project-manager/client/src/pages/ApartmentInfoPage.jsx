import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import ApartmentInfo from "../components/ApartmentInfo";
import ApartmentTenants from "../components/ApartmentTenants";
import ApartmentPayments from "../components/ApartmentPayments";
import { PlusIcon } from "lucide-react";

const PORT = import.meta.env.VITE_PORT;

const ApartmentInfoPage = () => {
  const { propertyId, apartmentId } = useParams();
  const [apartment, setApartment] = useState(null); // null until fetched
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(true); // true while fetching

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}`
        );
        console.log(res.data);
        setApartment(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching apartment", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load apartment");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [propertyId, apartmentId]);

  return (
    <div className="min-h-screen text-2xl">
      <Navbar />

      <div className="flex justify-between items-center p-2">
        <h1 className="text-3xl font-bold">
          Unit: {apartment ? apartment.unit : ""}
        </h1>
      </div>

      {isRateLimited && <RateLimitedUI />}

      {isLoading && (
        <div className="text-center text-primary py-10">
          Loading Apartment...
        </div>
      )}

      {!isLoading && apartment && !isRateLimited && (
        <>
          <div className="p-2 flex gap-4">
            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh]">
              <div className="overflow-y-auto">
                <ApartmentInfo apartment={apartment} />
              </div>
            </div>

            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-bold">
                  Tenants ({apartment.tenants?.length || 0})
                </h2>
                <button
                  className="btn btn-primary btn-sm rounded-full"
                  onClick={() => {}}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto">
                <ApartmentTenants apartment={apartment} />
              </div>
            </div>
          </div>

          <div className="w-screen px-2 mt-4">
            <div className="border border-solid border-[#000033] rounded-box p-2">
              <ApartmentPayments apartment={apartment} />
            </div>
          </div>


         
        </>
      )}
    </div>
  );
};

export default ApartmentInfoPage;
