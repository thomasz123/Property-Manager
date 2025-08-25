import { Property } from "../models/Property.js";

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
