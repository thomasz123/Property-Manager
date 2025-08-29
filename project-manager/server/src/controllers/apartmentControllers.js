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
    const apartment = property.apartments.id(req.params.apartmentId);
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

    const apartment = property.apartments.id(req.params.apartmentId);
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

    const { unit, notes } = req.body;
    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found." });

    // Only allow updating unit and notes
    if (unit !== undefined) apartment.unit = unit;
    if (notes !== undefined) apartment.notes = notes;

    await property.save();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error in updateApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addApartment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const { unit, notes } = req.body;

    const newApartment = property.apartments.push({
      unit,
      notes,
      tenants: [],
      leases: [],
    });

    await property.save();

    // Return the newly added apartment
    res.status(201).json(property.apartments[property.apartments.length - 1]);
  } catch (error) {
    console.error("Error in addApartment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------------- LEASES ---------------- */

export async function addLease(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const { rent, leaseStartDate, leaseEndDate, securityDeposit, leaseType } =
      req.body;

    apartment.leases.push({
      rent,
      leaseStartDate,
      leaseEndDate,
      securityDeposit,
      leaseType,
      payments: [],
    });

    await property.save();
    res.status(201).json(apartment.leases[apartment.leases.length - 1]);
  } catch (error) {
    console.error("Error in addLease Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLeases(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    // Sort leases by leaseStartDate ascending (oldest → newest)
    const sortedLeases = [...apartment.leases].sort(
      (a, b) => new Date(a.leaseStartDate) - new Date(b.leaseStartDate)
    );

    res.status(200).json(sortedLeases);
  } catch (error) {
    console.error("Error in getLeases Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteLease(req, res) {
  try {
    const { propertyId, apartmentId, leaseId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const lease = apartment.leases.id(leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    // Remove the lease
    apartment.leases.pull(req.params.leaseId);

    await property.save();

    res.status(200).json({
      message: "Lease successfully deleted",
      leases: apartment.leases,
    });
  } catch (error) {
    console.error("Error in deleteLease Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ---------------- PAYMENTS ---------------- */

export async function addPayment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const { amount, dateFor, datePaid } = req.body;
    const lease = apartment.leases.id(req.params.leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    lease.payments.push({ amount, dateFor, datePaid });

    await property.save();
    res.status(201).json(lease);
  } catch (error) {
    console.error("Error in addPayment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePayment(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const lease = apartment.leases.id(req.params.leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    const payment = lease.payments.id(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    lease.payments.pull(req.params.paymentId);
    await property.save();

    res.status(200).json(lease);
  } catch (error) {
    console.error("Error in deletePayment Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPayments(req, res) {
  try {
    const { propertyId, apartmentId, leaseId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const apartment = property.apartments.id(apartmentId);
    if (!apartment)
      return res.status(404).json({ message: "Apartment not found" });

    const lease = apartment.leases.id(leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    res.status(200).json(lease.payments);
  } catch (error) {
    console.error("Error in getPayments Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
