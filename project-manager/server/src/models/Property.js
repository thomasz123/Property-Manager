import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    apartments: [
      {
        unit: String,
        rent: Number,
        leaseStartDate: Date,
        leaseEndDate: Date,
        securityDeposit: Number,
        notes: String,
        leaseType: String,
        
        payments: [
          {
            datePaid: Date,
            amount: Number,
            dateFor: Date,
            currentRent: Number,
          },
        ],
        tenants: [
          {
            name: String,
            email: String,
            phone: String,
            people: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export { Property };
