import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import ApartmentInfo from "../components/ApartmentInfo";
import ApartmentTenants from "../components/ApartmentTenants";
import ApartmentPayments from "../components/ApartmentPayments";
import AddTenant from "../components/AddTenant";
import { useRef } from "react";
import { PlusIcon } from "lucide-react";

const PORT = import.meta.env.VITE_PORT;

const ApartmentInfoPage = () => {
  const { propertyId, apartmentId } = useParams();
  const [apartment, setApartment] = useState(null); // null until fetched
  const [leases, setLeases] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(true); // true while fetching

  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = (tenantFormData) => {
    modalRef.current?.close();
    handleAddTenant(tenantFormData);
  };

  const handleAddTenant = async (tenantFormData) => {
  try {
    const res = await axios.post(
      `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/tenants`,
      tenantFormData
    );

    // Add the new tenant to the apartment.tenants array
    setApartment(res.data);
    toast.success("Added tenant successfully");
  } catch (error) {
    console.log("Error adding tenant", error);
    toast.error("Failed to add tenant!");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteTenant = async (tenantId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this tenant?")) {
        return;
      }
      const tenantToDelete = apartment.tenants.find(
        (tenant) => tenant._id === tenantId
      );
      const res = await axios.delete(
        `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/tenants/${tenantId}`
      );
      setApartment((prev) => ({
        ...prev,
        tenants: prev.tenants.filter((tnt) => tnt._id !== tenantId),
      }));
      toast.success(`Successfully deleted ${tenantToDelete.name}`);
    } catch (error) {
      console.log("Error deleting tenant", error);
      toast.error("Error deleting tenant");
    }
  };

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

    const fetchLeases = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}/leases`
        );
        setLeases(res.data);
        console.log(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching leases", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load leases");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLeases();
    fetchApartment();
  }, []);

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
            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh] space-y-2">
              <div>
                <h2 className="card-title text-xl font-bold"> Info: </h2>
              </div>
              <div className="overflow-y-auto">
                <ApartmentInfo apartment={apartment} />
              </div>
            </div>

            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-bold">
                  Tenants ({apartment.tenants?.length || 0})
                </h2>
                <div>
                  <button className="btn btn-primary btn-sm rounded-full">
                    <PlusIcon className="w-4 h-4" onClick={openModal} />
                  </button>
                  <dialog ref={modalRef} id="my_modal_3" className="modal">
                    <div className="modal-box">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <AddTenant onSuccess={closeModal} />
                    </div>
                  </dialog>
                </div>
              </div>
              <div className="overflow-y-auto">
                <ApartmentTenants
                  apartment={apartment}
                  handleDeleteTenant={handleDeleteTenant}
                />
              </div>
            </div>
          </div>

          <div className="w-screen px-2 mt-4">
            <div className="border border-solid border-[#000033] rounded-box p-2">
              <ApartmentPayments apartment={apartment} leases={leases} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApartmentInfoPage;
