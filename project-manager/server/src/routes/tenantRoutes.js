import express from "express";
import {
  getTenants,
  deleteTenant,
  addTenant,
  updateTenant,
} from "../controllers/tenantControllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", getTenants);
router.put("/:tenantId", updateTenant);
router.post("/", addTenant);
router.delete("/:tenantId", deleteTenant);

export default router;
