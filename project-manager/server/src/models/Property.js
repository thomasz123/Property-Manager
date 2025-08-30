import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
    },
    apartments: [
      {
        unit: String,
        notes: String,
        leases: [
          {
            payments: [
              {
                amount: Number,
                datePaid: Date,
                dateFor: Date,
              },
            ],
            rent: Number,
            leaseStartDate: Date,
            leaseEndDate: Date,
            securityDeposit: Number,
            leaseType: String,
          },
        ],

        tenants: [
          {
            name: String,
            email: String,
            phone: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export { Property };
