import React from "react";
import AddApartment from "../components/AddApartment";
import { useParams } from "react-router";

const AddApartmentPage = () => {
  const { propertyId } = useParams();
  return (
    <div>
      <AddApartment propertyId={propertyId} />
    </div>
  );
};

export default AddApartmentPage;
