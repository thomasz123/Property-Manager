import { Route, Routes } from "react-router";
import PropertiesPage from "./pages/PropertiesPage";
import ApartmentsPage from "./pages/ApartmentsPage";
import AddApartmentPage from "./pages/AddApartmentPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import "./index.css";
import Navbar from "./components/Navbar";
import ApartmentInfoPage from "./pages/ApartmentInfoPage";

const App = () => {
  return (
    <div data-theme="corporate">
      <Routes>
        <Route path="/" element={<PropertiesPage />} />
        <Route path="/properties/:propertyId" element={<ApartmentsPage />} />
        <Route
          path="/:propertyId/addApartment"
          element={<AddApartmentPage />}
        />
        <Route path="/addProperty" element={<AddPropertyPage />} />
        <Route
          path="/properties/:propertyId/apartments/:apartmentId"
          element={<ApartmentInfoPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
