import { Property } from "../models/Property.js";

export async function getProperties(req, res) {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in getProperties Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProperty(req, res) {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    console.error("Error in getProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProperty(req, res) {
  try {
    const deletedProperty = await Property.findByIdAndDelete(
      req.params.propertyId
    );
    if (!deleteProperty)
      return res.status(404).json({ message: "Property not found" });
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error("Error in deleteProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProperty(req, res) {
  try {
    const { address, apartments } = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.propertyId,
      { address, apartments },
      { new: true }
    );
    if (!updatedProperty)
      return res.status(404).json({ message: "Property not found." });
    res.status(200).json(updatedProperty);
  } catch {
    console.error("Error in updateProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addProperty(req, res) {
  try {
    const { address } = req.body;
    const newProperty = new Property({ address });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error in addProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
