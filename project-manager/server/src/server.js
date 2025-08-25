import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(rateLimiter);

app.use("/api/properties", propertyRoutes);
app.use("/api/properties", apartmentRoutes);
app.use("/api/properties", tenantRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
  });
});
