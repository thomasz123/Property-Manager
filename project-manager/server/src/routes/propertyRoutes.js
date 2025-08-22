import express from "express";
import apartmentRoutes from "./apartmentRoutes.js";
import {
  getProperty,
  getProperties,
  deleteProperty,
  addProperty,
  updateProperty,
} from "../controllers/propertyControllers.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/:propertyId", getProperty);
router.put("/:propertyId", updateProperty);
router.post("/", addProperty);
router.delete("/:propertyId", deleteProperty);

router.use("/:propertyId/apartment", apartmentRoutes);

export default router;

// add statuses later
