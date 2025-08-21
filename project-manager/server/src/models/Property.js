import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
});
const Tenant = mongoose.model("Tenant", tenantSchema);

const apartmentSchema = new mongoose.Schema({
  Unit: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Rent: {
    type: Number,
    required: true,
  },
  Tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  ],
});
const Apartment = mongoose.model("Apartment", apartmentSchema);

const propertySchema = new mongoose.Schema(
  {
    Address: {
      type: String,
      required: true,
    },
    Apartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
  },
  { timestamps: true }
);
const Property = mongoose.model("Property", propertySchema);

export default Property;
