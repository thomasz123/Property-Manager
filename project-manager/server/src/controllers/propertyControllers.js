import { Property } from "../models/Property.js";

// Get all properties for the logged-in user
export async function getProperties(req, res) {
  try {
    const properties = await Property.find({ owner: req.user.uid });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in getProperties Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a single property owned by the user
export async function getProperty(req, res) {
  try {
    const property = await Property.findOne({
      _id: req.params.propertyId,
      owner: req.user.uid,
    });

    if (!property)
      return res
        .status(404)
        .json({ message: "Property not found or unauthorized" });

    res.status(200).json(property);
  } catch (error) {
    console.error("Error in getProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a property (only if owned by user)
export async function deleteProperty(req, res) {
  try {
    const deletedProperty = await Property.findOneAndDelete({
      _id: req.params.propertyId,
      owner: req.user.uid,
    });

    if (!deletedProperty)
      return res
        .status(404)
        .json({ message: "Property not found or unauthorized" });

    const properties = await Property.find({ owner: req.user.uid });
    res.json(properties);
  } catch (error) {
    console.error("Error in deleteProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update property (only if owned by user)
export async function updateProperty(req, res) {
  try {
    const { address, apartments } = req.body;

    const updatedProperty = await Property.findOneAndUpdate(
      { _id: req.params.propertyId, owner: req.user.uid },
      { address, apartments },
      { new: true }
    );

    if (!updatedProperty)
      return res
        .status(404)
        .json({ message: "Property not found or unauthorized" });

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error in updateProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Add a new property tied to the logged-in user
export async function addProperty(req, res) {
  try {
    const { address } = req.body;
    const owner = req.user.uid; // Firebase UID

    const newProperty = new Property({ owner, address });
    const savedProperty = await newProperty.save();

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error in addProperty Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
