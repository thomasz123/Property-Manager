import { Link } from "react-router";
import { PenSquareIcon, TrashIcon } from "lucide-react";
import { formatDate, formatCurrency } from "../lib/utils";

const ApartmentCard = ({ propertyId, apartment }) => {
  return (
    <Link
      to={`/properties/${propertyId}/apartments`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#000033]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{apartment.unit}</h3>
        <h6 className="card-content">Rent: {formatCurrency(apartment.rent)}</h6>
        <div className="flex items-center gap-1">
          <span className="text-sm text-base-content/60">
            Lease Ends: {formatDate(new Date(apartment.leaseEndDate))}
          </span>
          <div className="ml-auto">
            <button className="btn btn-ghost btn-xs">
              <PenSquareIcon className="size-4" />
            </button>
            <button className="btn btn-ghost btn-xs text-error">
              <TrashIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApartmentCard;
