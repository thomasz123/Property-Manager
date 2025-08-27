import { Property } from "../models/Property.js";
import mongoose from "mongoose";

export async function getApartments(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property.apartments);
  } catch (error) {
    console.error("Error in getApartments Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getApartment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const apartment = await property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error in getApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteApartment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = await property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    property.apartments.pull(req.params.apartmentId);
    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error("Error in deleteApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateApartment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const {
      unit,
      leaseStartDate,
      leaseEndDate,
      rent,
      tenants,
      notes,
      securityDeposit,
      leaseType,
      payments,
    } = req.body;
    const apartment = await property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found." });

    if (unit !== undefined) apartment.unit = unit;
    if (rent !== undefined) apartment.rent = rent;
    if (leaseStartDate !== undefined) apartment.leaseStartDate = leaseStartDate;
    if (leaseEndDate !== undefined) apartment.leaseEndDate = leaseEndDate;
    if (tenants !== undefined) apartment.tenants = tenants;
    if (notes !== undefined) apartment.notes = notes;
    if (securityDeposit !== undefined)
      apartment.securityDeposit = securityDeposit;
    if (leaseType !== undefined) apartment.leaseType = leaseType;
    if (payments !== undefined) apartment.payments = payments;

    await property.save();
    res.status(200).json(apartment);
  } catch {
    console.error("Error in updateApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addApartment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const {
      unit,
      leaseStartDate,
      leaseEndDate,
      rent,
      tenants,
      notes,
      securityDeposit,
      payments,
      leaseType,
    } = req.body;

    const newApartment = property.apartments.push({
      unit,
      leaseStartDate,
      leaseEndDate,
      rent,
      tenants: tenants ?? [],
      notes,
      securityDeposit,
      payments,
      leaseType,
    });
    const savedApartment = await property.save();
    res.status(201).json(savedApartment);
  } catch (error) {
    console.error("Error in addApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLeases(req, res) {
  const paymentsByLease = await Property.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.propertyId) } },
    { $unwind: "$apartments" },
    {
      $match: {
        "apartments._id": new mongoose.Types.ObjectId(req.params.apartmentId),
      },
    },
    { $unwind: "$apartments.payments" },
    {
      $group: {
        _id: "$apartments.payments.leaseStart",
        leaseEnd: { $first: "$apartments.payments.leaseEnd" },
        payments: {
          $push: {
            _id: "$apartments.payments._id",
            amount: "$apartments.payments.amount",
            dateFor: "$apartments.payments.dateFor",
            datePaid: "$apartments.payments.datePaid",
          },
        },
        currentRent: { $first: "$apartments.payments.currentRent" },
        totalAmount: { $sum: "$apartments.payments.amount" },
      },
    },
    { $sort: { _id: -1 } }, // Sort by year descending (newest first)
    {
      $project: {
        _id: 0,
        leaseStart: "$_id",
        leaseEnd: 1,
        currentRent: 1,
        payments: 1,
        totalAmount: 1,
        totalExpected: 1,
      },
    },
  ]);

  res.json(paymentsByLease);
}

export async function deletePayment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = await property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const payment = await apartment.payments.id(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    apartment.payments.pull(req.params.paymentId);
    await property.save();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error in deletePayment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addPayment(req, res) {}
