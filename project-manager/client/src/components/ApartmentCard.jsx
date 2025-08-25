import { Link } from "react-router";
import { PenSquareIcon, TrashIcon } from "lucide-react";
import { formatDate, formatCurrency } from "../lib/utils";
import EditApartment from "../components/EditApartment";
import { useRef } from "react";

const ApartmentCard = ({
  propertyId,
  apartment,
  deleteApartmentCard,
  editApartmentCard,
}) => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = (updatedFormData) => {
    modalRef.current?.close();
    editApartmentCard(apartment._id, updatedFormData);
  };

  return (
    <div className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#000033]">
      <Link to={`/properties/${propertyId}/apartments/${apartment._id}`}>
        <div className="card-body">
          <h3 className="card-title text-base-content">{apartment.unit}</h3>
          <h6 className="card-content">
            Rent: {formatCurrency(apartment.rent)}
          </h6>
          <div className="flex items-center gap-1">
            <span className="text-sm text-base-content/60">
              Lease Ends: {formatDate(new Date(apartment.leaseEndDate))}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex justify-end p-4">
        <button className="btn btn-ghost btn-xs" onClick={openModal}>
          <PenSquareIcon className="size-6" />
        </button>

        <dialog ref={modalRef} id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <EditApartment
              propertyId={propertyId}
              apartment={apartment}
              onSuccess={closeModal}
            />
          </div>
        </dialog>

        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={() => deleteApartmentCard(propertyId, apartment._id)}
        >
          <TrashIcon className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default ApartmentCard;
