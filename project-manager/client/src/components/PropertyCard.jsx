import { Link } from "react-router";
import { PenSquareIcon, TrashIcon } from "lucide-react";

const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/properties/${property._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#000033]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{property.address}</h3>
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-xs">
            <PenSquareIcon className="size-4" />
          </button>
          <button className="btn btn-ghost btn-xs text-error">
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
