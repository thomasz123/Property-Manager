import express from "express"
import { getProperty, deleteProperty, addProperty, updateProperty } from "../controllers/propertyControllers.js";

const router = express.Router();

router.get("/", getProperty);

router.put("/:id", updateProperty);

router.post("/", addProperty);

router.delete("/:id", deleteProperty); 

export default router

// add statuses later
