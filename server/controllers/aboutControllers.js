import About from '../models/About.js';

// Get About Info
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne(); // Assuming only one about document
    // If no document exists, return a default empty object to prevent frontend errors
    if (!about) {
      return res.status(200).json({});
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch about data' });
  }
};

// Update or Create About Info (Upsert)
export const updateAbout = async (req, res) => {
  try {
    const data = req.body;
    
    // Find the single document and update it with the entire request body.
    // If it doesn't exist, create it (upsert: true).
    const updatedAbout = await About.findOneAndUpdate({}, data, {
      new: true,           // Return the updated document
      upsert: true,        // Create the document if it doesn't exist
      runValidators: true, // Ensure the update follows schema rules
    });

    res.status(200).json({ message: "About information updated successfully.", data: updatedAbout });
  } catch (error) {
    console.error("Error updating about data:", error);
    res.status(500).json({ message: 'Failed to update about data' });
  }
};

// This function is not strictly needed for the form but is good practice to have.
export const deleteAbout = async (req, res) => {
  try {
    await About.deleteMany({}); // Deletes all 'about' documents
    res.status(200).json({ message: 'About info deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete about data' });
  }
};