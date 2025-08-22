import express from "express";
import tenantRoutes from "./tenantRoutes.js"
import {
  getApartment,
  getApartments,
  deleteApartment,
  addApartment,
  updateApartment,
} from "../controllers/apartmentControllers.js";

const router = express.Router({ mergeParams: true });


router.get("/", getApartments);
router.get("/:apartmentId", getApartment);
router.put("/:apartmentId", updateApartment);
router.post("/", addApartment);
router.delete("/:apartmentId", deleteApartment);

router.use("/:apartmentId/tenant", tenantRoutes)

export default router;

// add statuses later
