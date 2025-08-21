import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"
import propertyRoutes from "./routes/propertyRoutes.js"

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use("/api/property", propertyRoutes);

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Express!" })
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});