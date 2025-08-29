import express from "express";
import tenantRoutes from "./tenantRoutes.js";
import {
  getApartment,
  getApartments,
  deleteApartment,
  addApartment,
  updateApartment,
  getLeases,
  addLease,
  deleteLease,
  getPayments,
  addPayment,
  deletePayment,
} from "../controllers/apartmentControllers.js";

const router = express.Router({ mergeParams: true });

// ----- Apartments -----
router.get("/", getApartments);
router.post("/", addApartment);

router.get("/:apartmentId", getApartment);
router.put("/:apartmentId", updateApartment);
router.delete("/:apartmentId", deleteApartment);

// ----- Leases -----
router.get("/:apartmentId/leases", getLeases);
router.post("/:apartmentId/leases", addLease);
router.delete("/:apartmentId/leases/:leaseId", deleteLease)

// ----- Payments (nested under leases) -----
router.get("/:apartmentId/leases/:leaseId/payments", getPayments);
router.post("/:apartmentId/leases/:leaseId/payments", addPayment);
router.delete("/:apartmentId/leases/:leaseId/payments/:paymentId", deletePayment);

// ----- Tenants -----
router.use("/:apartmentId/tenants", tenantRoutes);

export default router;
