import { Link } from "react-router";
import { PenSquareIcon, TrashIcon } from "lucide-react";
import { useRef } from "react";
import EditProperty from "./EditProperty";

const PORT = import.meta.env.VITE_PORT;

const PropertyCard = ({ property, deletePropertyCard, editPropertyCard }) => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = (updatedFormData) => {
    modalRef.current?.close();
    editPropertyCard(property._id, updatedFormData);
  };

  return (
    <div className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#000033]">
      <Link to={`/properties/${property._id}`}>
        <div className="card-body">
          <h3 className="card-title text-base-content">{property.address}</h3>
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

            <EditProperty
              property={property}
              onSuccess={closeModal}
            />
          </div>
        </dialog>

        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={() => deletePropertyCard(property._id)}
        >
          <TrashIcon className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
