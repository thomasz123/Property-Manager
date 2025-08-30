import { Property } from "../models/Property.js";

export async function addTenant(req, res) {
  try {
    const { name, email, phone, people } = req.body;

    const property = await Property.findOne({
      _id: req.params.propertyId,
      owner: req.user.uid, // ✅ ensure ownership
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found or unauthorized" });
    }

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const newTenant = { name, email, phone, people };

    apartment.tenants.push(newTenant);
    await property.save();

    res.status(201).json(apartment);
  } catch (error) {
    console.error("Error in addTenant Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTenant(req, res) {
  try {
    const property = await Property.findOne({
      _id: req.params.propertyId,
      owner: req.user.uid, // ✅ secure
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found or unauthorized" });
    }

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const tenant = apartment.tenants.id(req.params.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    apartment.tenants.pull(req.params.tenantId);

    await property.save();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error in deleteTenant Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTenant(req, res) {
  try {
    const { name, email, phone, people } = req.body;

    const property = await Property.findOne({
      _id: req.params.propertyId,
      owner: req.user.uid, // ✅ secure
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found or unauthorized" });
    }

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const tenant = apartment.tenants.id(req.params.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (name !== undefined) tenant.name = name;
    if (email !== undefined) tenant.email = email;
    if (phone !== undefined) tenant.phone = phone;
    if (people !== undefined) tenant.people = people;

    await property.save();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error in updateTenant Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTenants(req, res) {
  try {
    const property = await Property.findOne({
      _id: req.params.propertyId,
      owner: req.user.uid, // ✅ secure
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found or unauthorized" });
    }

    const apartment = property.apartments.id(req.params.apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    res.status(200).json(apartment.tenants);
  } catch (error) {
    console.error("Error in getTenants Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
