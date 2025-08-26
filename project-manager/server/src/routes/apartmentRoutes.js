import express from "express";
import tenantRoutes from "./tenantRoutes.js"
import {
  getApartment,
  getApartments,
  deleteApartment,
  addApartment,
  updateApartment,
  getLeases,
} from "../controllers/apartmentControllers.js";

const router = express.Router({ mergeParams: true });


router.get("/", getApartments);
router.get("/:apartmentId", getApartment);
router.put("/:apartmentId", updateApartment);
router.post("/", addApartment);
router.delete("/:apartmentId", deleteApartment);
router.get("/:apartmentId/leases", getLeases);

router.use("/:apartmentId/tenants", tenantRoutes)

export default router;

// add statuses later
