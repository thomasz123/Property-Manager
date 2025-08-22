import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO DB COONNECTED SUCCESSFULLY");
  } catch (error) {
    console.error("FAILED TO CONNECT", error);
    process.exit(1);
  }
};
