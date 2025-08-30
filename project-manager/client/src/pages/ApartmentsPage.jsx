import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import { useParams, Link, useNavigate } from "react-router";
import ApartmentCard from "../components/ApartmentCard";
import { PlusCircle } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PORT = import.meta.env.VITE_PORT;

const ApartmentPage = () => {
  const { propertyId } = useParams();
  const [apartments, setApartments] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(true);

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
          url: `http://localhost:${PORT}/api/properties/${propertyId}`,
        });
        setApartments(res.data.apartments || []);
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
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteApartment = async (propertyId, apartmentId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this apartment?")) {
        return;
      }
      const apartmentToDelete = apartments.find(
        (apartment) => apartment._id === apartmentId
      );
      await axiosAuth({
        method: "delete",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}`,
      });

      setApartments((prevApartments) =>
        prevApartments.filter((apt) => apt._id !== apartmentId)
      );
      toast.success(`Successfully deleted ${apartmentToDelete.unit}`);
    } catch (error) {
      console.log("Error deleting property", error);
      toast.error("Error deleting property");
    }
  };

  const handleEditApartment = async (apartmentId, updatedFormData) => {
    try {
      const res = await axiosAuth({
        method: "put",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}`,
        data: updatedFormData,
      });
      setApartments((prev) =>
        prev.map((apt) => (apt._id === apartmentId ? res.data : apt))
      );
      toast.success("Apartment successfully modified");
    } catch (error) {
      console.log("Error modifying apartment", error);
      toast.error("Failed to modify apartment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto [scrollbar-gutter:stable]">
      <Navbar />
      <div className="flex justify-between items-center mb-6 p-5">
        <h1 className="text-3xl font-bold">Apartments:</h1>
        <Link
          to={`/${propertyId}/addApartment`}
          className="btn btn-primary rounded-full"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Apartment
        </Link>
      </div>

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">
            Loading Apartments...
          </div>
        )}

        {!isLoading && apartments.length === 0 && !isRateLimited && (
          <div className="text-center py-10 text-gray-500">No apartments found.</div>
        )}

        {apartments.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <div className="p-5" key={apartment._id}>
                <ApartmentCard
                  propertyId={propertyId}
                  apartment={apartment}
                  deleteApartmentCard={handleDeleteApartment}
                  editApartmentCard={handleEditApartment}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentPage;