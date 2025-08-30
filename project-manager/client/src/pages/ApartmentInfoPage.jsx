import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import RateLimitedUI from "../components/RateLimitedUI";
import ApartmentInfo from "../components/ApartmentInfo";
import ApartmentTenants from "../components/ApartmentTenants";
import ApartmentPayments from "../components/ApartmentPayments";
import AddTenant from "../components/AddTenant";
import AddPayment from "../components/AddPayment";
import { PlusIcon } from "lucide-react";

const PORT = import.meta.env.VITE_PORT;

const ApartmentInfoPage = () => {
  const { propertyId, apartmentId } = useParams();
  const [apartment, setApartment] = useState(null);
  const [leases, setLeases] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const tenantModalRef = useRef(null);

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

  const openTenantModal = () => tenantModalRef.current?.showModal();
  const closeTenantModal = () => tenantModalRef.current?.close();

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

  const handleAddLease = async (leaseFormData) => {
    try {
      setLoading(true);
      const res = await axiosAuth({
        method: "post",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/leases`,
        data: leaseFormData,
      });
      setLeases((prev) => [res.data, ...prev]);
      toast.success("Lease added successfully");
    } catch (err) {
      console.error("Error adding lease", err);
      toast.error("Failed to add lease");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLease = async (leaseId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this lease?"))
        return;
      await axiosAuth({
        method: "delete",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/leases/${leaseId}`,
      });
      setLeases((prev) => prev.filter((l) => l._id !== leaseId));
      toast.success("Lease deleted successfully");
    } catch (err) {
      console.error("Error deleting lease", err);
      toast.error("Failed to delete lease");
    }
  };

  const handleAddTenant = async (tenantFormData) => {
    try {
      const res = await axiosAuth({
        method: "post",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/tenants`,
        data: tenantFormData,
      });
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
      if (!window.confirm("Are you sure you want to delete this tenant?"))
        return;
      const tenantToDelete = apartment.tenants.find(
        (tenant) => tenant._id === tenantId
      );
      await axiosAuth({
        method: "delete",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/tenants/${tenantId}`,
      });
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

  const handleDeletePayment = async (leaseId, paymentId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this payment?"))
        return;

      const res = await axiosAuth({
        method: "delete",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/leases/${leaseId}/payments/${paymentId}`,
      });

      setLeases((prevLeases) =>
        prevLeases.map((lease) =>
          lease._id === res.data._id ? res.data : lease
        )
      );

      toast.success("Successfully deleted payment");
    } catch (error) {
      console.log("Error deleting payment", error);
      toast.error("Error deleting payment");
    }
  };

  const handleAddPayment = async (paymentFormData) => {
    try {
      const parsedFormData = {
        ...paymentFormData,
        dateFor: new Date(2025, monthsDict[paymentFormData.dateFor], 1),
        datePaid: paymentFormData.datePaid,
        amount: paymentFormData.amount,
        leaseId: paymentFormData.leaseId,
      };

      const res = await axiosAuth({
        method: "post",
        url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartment._id}/leases/${paymentFormData.leaseId}/payments`,
        data: parsedFormData,
      });

      setLeases((prevLeases) =>
        prevLeases.map((lease) =>
          lease._id === res.data._id ? res.data : lease
        )
      );
      toast.success("Added payment successfully");
    } catch (error) {
      console.log("Error adding payment", error);
      toast.error("Failed to add payment!");
    } finally {
      setLoading(false);
    }
  };

  // Authentication check effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      // User is authenticated, fetch data
      setLoading(true);
      try {
        const [apartmentRes, leasesRes] = await Promise.all([
          axiosAuth({
            method: "get",
            url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}`,
          }),
          axiosAuth({
            method: "get",
            url: `http://localhost:${PORT}/api/properties/${propertyId}/apartments/${apartmentId}/leases`,
          }),
        ]);

        setApartment(apartmentRes.data);
        setLeases(leasesRes.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching data", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load apartment data");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
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

      {!isLoading && apartment && leases && !isRateLimited && (
        <>
          <div className="p-2 flex gap-4">
            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh] space-y-2">
              <div>
                <h2 className="card-title text-xl font-bold"> Info: </h2>
              </div>
              <div className="overflow-y-auto">
                <ApartmentInfo
                  apartment={apartment}
                  leases={leases}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <div className="card bg-base-100 border border-solid border-[#000033] p-4 flex-1 h-[35vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-bold">
                  Tenants ({apartment.tenants?.length || 0})
                </h2>
                <div>
                  <button
                    className="btn btn-primary btn-sm rounded-full"
                    onClick={openTenantModal}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <dialog
                    ref={tenantModalRef}
                    id="my_modal_3"
                    className="modal"
                  >
                    <div className="modal-box">
                      <form method="dialog">
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
              <ApartmentPayments
                apartment={apartment}
                leases={leases}
                handleAddPayment={handleAddPayment}
                handleDeletePayment={handleDeletePayment}
                handleAddLease={handleAddLease}
                handleDeleteLease={handleDeleteLease}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApartmentInfoPage;
