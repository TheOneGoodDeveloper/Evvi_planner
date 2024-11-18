const fs = require("fs");
const path = require("path");

const SafetyModel = require("../Model/Safety_model.js");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    }
  });
};

// CREATE SAFETY
const createSafety = async (req, res) => {
  try {
    const { title, content, author, metaKeywords, metaDescription } = req.body;

    // Retrieve filenames from `req.files`
    const safetyImage = req.files.image ? req.files.image[0].filename : null;
    const safetyThumbnail = req.files.thumbnail
      ? req.files.thumbnail[0].filename
      : null;

    // Call the model with the correct arguments
    const result = await SafetyModel.createSafety(
      title,                
      content,              
      "Safety Net",         
      safetyImage,          
      safetyThumbnail,      
      author,               
      metaKeywords,         
      metaDescription       
    );

    return res
      .status(201)
      .json({ status: true, message: "Safety record created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};


// GET ALL SAFETY RECORDS
const getAllSafety = async (req, res) => {
  try {
    const safetyRecords = await SafetyModel.getAllSafety();

    if (safetyRecords.length > 0) {
      return res.status(200).json({ status: true, safetyRecords });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "No safety records found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET SAFETY RECORD BY ID
const getSafetyById = async (req, res) => {
  try {
    const id = req.params.id;
    const safetyRecord = await SafetyModel.getSafetyById(id);

    if (safetyRecord.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Safety record not found" });
    }

    return res.status(200).json({ status: true, safetyRecord });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// UPDATE SAFETY RECORD
const updateSafety = async (req, res) => {
  try {
    const { id,title, content, author, metaKeywords, metaDescription } = req.body;
      console.log(req.body);
    const newSafetyImage = req.files?.image
      ? req.files.image[0].filename
      : req.body.safetyImage;
    const newThumbnail = req.files?.thumbnail
      ? req.files.thumbnail[0].filename
      : req.body.safetyThumbnail;

    const safetyRecord = await SafetyModel.getSafetyById(id);
    if (safetyRecord.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Safety record not found" });
    }

    // Delete old images if new ones are uploaded
    if (req.files?.image && safetyRecord[0].safety_image) {
      const oldSafetyImagePath = path.join(
        __dirname,
        "../safety_images/",
        safetyRecord[0].safety_image
      );
      deleteOldImage(oldSafetyImagePath);
    }

    if (req.files?.thumbnail && safetyRecord[0].safety_thumbnail) {
      const oldThumbnailPath = path.join(
        __dirname,
        "../safety_images/",
        safetyRecord[0].safety_thumbnail
      );
      deleteOldImage(oldThumbnailPath);
    }

    // Update the safety record in the database
    const result = await SafetyModel.updateSafety( {id,
      title,
      content:content||safetyRecord[0].safety_body,
      category: "Safety Net",
      safety_image: newSafetyImage || safetyRecord[0].safety_image,
      safety_thumbnail: newThumbnail || safetyRecord[0].safety_thumbnail,
      author,
      metaKeywords,
      metaDescription,
    });
    

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Safety record not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Safety record updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// DELETE SAFETY RECORD
const deleteSafety = async (req, res) => {
  try {
    const id = req.params.id;
    const safetyRecord = await SafetyModel.getSafetyById(id);

    if (safetyRecord.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Safety record not found" });
    }

    if (safetyRecord[0].safety_image) {
      const imagePath = path.join(
        __dirname,
        "../safety_images/",
        safetyRecord[0].safety_image
      );
      deleteOldImage(imagePath);
    }

    const result = await SafetyModel.deleteSafety(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Safety record not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Safety record deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// LATEST SAFETY RECORDS
const latestSafety = async (req, res) => {
  try {
    const safetyRecords = await SafetyModel.getLatestSafety();

    if (!safetyRecords || safetyRecords.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No safety records found" });
    }

    return res.status(200).json({ status: true, safetyRecords });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

module.exports = {
  createSafety,
  getAllSafety,
  getSafetyById,
  updateSafety,
  deleteSafety,
  latestSafety,
};
