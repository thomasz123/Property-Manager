import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  apartments: [{
    unit: String,
    rent: Number,
    leaseStartDate: Date,
    leaseEndDate: Date,
    notes: String,
    tenants: [{
      name: String,
      email: String,
      phone: String,
    }]
  }],
  //totalUnits: Number,
}, { timestamps: true });

const Property = mongoose.model("Property", propertySchema);

export { Property };
