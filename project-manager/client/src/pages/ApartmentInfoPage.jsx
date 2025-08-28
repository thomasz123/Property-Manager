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
import AddPayment from "../components/AddPayment";
import { useRef } from "react";
import { PlusIcon } from "lucide-react";

const PORT = import.meta.env.VITE_PORT;

const ApartmentInfoPage = () => {
  const { propertyId, apartmentId } = useParams();
  const [apartment, setApartment] = useState(null); // null until fetched
  const [leases, setLeases] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(true); // true while fetching

  const tenantModalRef = useRef(null);
  const paymentModalRef = useRef(null);

  const openTenantModal = () => {
    tenantModalRef.current?.showModal();
  };

  const closeTenantModal = () => {
    tenantModalRef.current?.close();
  };

  const openPaymentModal = () => {
    paymentModalRef.current?.showModal();
  };

  const closePaymentModal = () => {
    paymentModalRef.current?.close();
  };
  const monthsDict = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const handleAddTenant = async (tenantFormData) => {
    try {
      const res = await axios.post(
        `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/tenants`,
        tenantFormData
      );

      // Add the new tenant to the apartment.tenants array
      setApartment(res.data);
      closeTenantModal();
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

  const handleDeletePayment = async (paymentId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this payment?")) {
        return;
      }
      const res = await axios.delete(
        `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/payments/${paymentId}`
      );
      setLeases((prevLeases) =>
        prevLeases.map((lease) => ({
          ...lease,
          payments: lease.payments.filter(
            (payment) => payment._id !== paymentId
          ),
        }))
      );
      setApartment(res.data)
      toast.success(`Successfully deleted payment`);
    } catch (error) {
      console.log("Error deleting payment", error);
      toast.error("Error deleting payment");
    }
  };

  const handleAddPayment = async (paymentFormData) => {
    try {
      console.log("hullo");
      const parsedFormData = {
        ...paymentFormData,
        dateFor: new Date(2025, monthsDict[paymentFormData.dateFor], 1),
        currentRent: apartment.rent,
        leaseStart: new Date(apartment.leaseStartDate),
        leaseEnd: new Date(apartment.leaseEndDate)
      };

      const res = await axios.post(
        `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/payments`,
        parsedFormData
      );
      console.log(res.data);
      // Add the new tenant to the apartment.tenants array
      setApartment(res.data);
      
      closePaymentModal();
      toast.success("Added payment successfully");
    } catch (error) {
      console.log("Error adding payment", error);
      toast.error("Failed to add payment!");
    } finally {
      setLoading(false);
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
                    <PlusIcon className="w-4 h-4" onClick={openTenantModal} />
                  </button>
                  <dialog
                    ref={tenantModalRef}
                    id="my_modal_3"
                    className="modal"
                  >
                    <div className="modal-box">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <AddTenant onSuccess={handleAddTenant} />
                    </div>
                  </dialog>
                </div>
              </div>
              <div className="overflow-y-auto">
                <ApartmentTenants
                  apartment={apartment}
                  handleDeleteTenant={handleDeleteTenant}
                  handleAddTenant={closeTenantModal}
                />
              </div>
            </div>
          </div>

          <div className="w-full px-2 mt-4">
            <div className="border border-solid border-[#000033] rounded-box p-6">
              <div className="flex justify-between items-center ">
                <h2 className="card-title text-xl font-bold">
                  Payments ({leases?.length || 0} lease terms)
                </h2>
                <button
                  className="btn btn-primary btn-sm rounded-full"
                  onClick={openPaymentModal}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
                <dialog ref={paymentModalRef} id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <AddPayment onSuccess={handleAddPayment} />
                  </div>
                </dialog>
              </div>
              <ApartmentPayments
                apartment={apartment}
                leases={leases}
                handleAddPayment={handleAddPayment}
                handleDeletePayment={handleDeletePayment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApartmentInfoPage;
