import { Link } from "react-router"


const ApartmentCard = ({propertyId, apartment}) => {
  return (
    <Link to={`/properties/${propertyId}/apartments`} 
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#000033]">
            <div className="card-body">
                <h3 className="card-title text-base-content">{apartment.unit | apartment.rent}</h3>
            </div>
    </Link>

  )
}

export default ApartmentCard