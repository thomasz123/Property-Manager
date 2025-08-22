import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/property", propertyRoutes);
app.use("/api/property", apartmentRoutes);
app.use("/api/property", tenantRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
  });
});
