import { Route, Routes } from "react-router";
import PropertyPage from "./pages/PropertyPage";
import ApartmentPage from "./pages/ApartmentPage";
import AddApartmentPage from "./pages/AddApartmentPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import toast from "react-hot-toast";
import "./index.css";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div data-theme="corporate">
      <Routes>
        <Route path="/" element={<PropertyPage />} />
        <Route path="/properties/:propertyId" element={<ApartmentPage />} />
        {/* <Route
          path="/properties/:propertyId/apartments/:apartmentId"
          element={<TenantPage />}
        /> */}
        <Route
          path="/:propertyId/addApartment"
          element={<AddApartmentPage />}
        />
        <Route
          path="/addProperty"
          element={<AddPropertyPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
