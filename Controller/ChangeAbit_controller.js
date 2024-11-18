const fs = require("fs");
const path = require("path");

const ChangeAbitModel = require("../Model/ChangeAbit_model.js");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    }
  });
};

// CREATE CHANGEABIT
const createChangeAbit = async (req, res) => {
  try {
    const { title, content, author, metaKeywords, metaDescription } = req.body;
    if (!title || !content || !author || !metaKeywords || !metaDescription) {
      return res
        .status(400)
        .json({ status: false, message: "Please Enter required Fields" });
    }
    // console.log(req.files.image);

    const changeAbitImage = req.files.image
      ? req.files.image[0].filename
      : null;
    const changeAbitThumbnail = req.files.thumbnail
      ? req.files.thumbnail[0].filename
      : null;

    const result = await ChangeAbitModel.createChangeAbit({
      title,
      content,
      category: "ChangeABit",
      changeAbitImage,
      changeAbitThumbnail,
      author,
      metaKeywords,
      metaDescription,
    });

    return res
      .status(201)
      .json({ status: true, message: "ChangeAbit created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET ALL CHANGEABITS
const getAllChangeAbits = async (req, res) => {
  try {
    const changeAbits = await ChangeAbitModel.getAllChangeAbits();

    if (changeAbits.length > 0) {
      return res.status(200).json({ status: true, changeAbits });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "No changeAbits found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET CHANGEABIT BY ID
const getChangeAbitById = async (req, res) => {
  try {
    const id = req.params.id;
    const changeAbit = await ChangeAbitModel.getChangeAbitById(id);

    if (!changeAbit) {
      return res
        .status(404)
        .json({ status: false, message: "ChangeAbit not found" });
    }

    return res.status(200).json({ status: true, changeAbit });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// UPDATE CHANGEABIT
const updateChangeAbit = async (req, res) => {
  try {
    const { id, title, content, author, metaKeywords, metaDescription } =
      req.body;
    if (!title || !content || !author || !metaKeywords || !metaDescription) {
      return res
        .status(400)
        .json({ status: false, message: "Please Enter required Fields" });
    }
    console.log(req.body);
    console.log(req.files);
    // Handle files
    const newChangeAbitImage = req.files?.image
      ? req.files.image[0].filename
      : req.body.changeAbitImage;
    const newThumbnail = req.files?.thumbnail
      ? req.files.thumbnail[0].filename
      : req.body.thumbnail;

    const changeAbit = await ChangeAbitModel.getChangeAbitById(id);
    if (!changeAbit) {
      return res
        .status(404)
        .json({ status: false, message: "ChangeAbit not found" });
    }

    // Deleting old images if new ones are provided
    if (req.files?.image && changeAbit.changeAbitImage) {
      const oldImagePath = path.join(
        __dirname,
        "../Assets/changeAbit_images",
        changeAbit.changeAbitImage
      );
      deleteOldImage(oldImagePath);
    }

    if (req.files?.thumbnail && changeAbit.thumbnail) {
      const oldThumbnailPath = path.join(
        __dirname,
        "../Assets/changeAbit_images",
        changeAbit.thumbnail
      );
      deleteOldImage(oldThumbnailPath);
    }

    const result = await ChangeAbitModel.updateChangeAbit(id, {
      title,
      content,
      category: "ChangeABit",
      changeAbitImage: newChangeAbitImage || changeAbit.changeAbit_image,
      thumbnail: newThumbnail || changeAbit.thumbnail,
      author,
      metaKeywords,
      metaDescription,
    });

    return res
      .status(200)
      .json({ status: true, message: "ChangeAbit updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// DELETE CHANGEABIT
const deleteChangeAbit = async (req, res) => {
  try {
    const id = req.params.id;
    const changeAbit = await ChangeAbitModel.getChangeAbitById(id);

    if (!changeAbit) {
      return res
        .status(404)
        .json({ status: false, message: "ChangeAbit not found" });
    }

    if (changeAbit.changeAbitImage) {
      const imagePath = path.join(
        __dirname,
        "../changeabit_images/",
        changeAbit.changeAbitImage
      );
      deleteOldImage(imagePath);
    }

    const result = await ChangeAbitModel.deleteChangeAbit(id);
    return res
      .status(200)
      .json({ status: true, message: "ChangeAbit deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// LATEST CHANGEABITS
const latestChangeAbits = async (req, res) => {
  try {
    const changeAbits = await ChangeAbitModel.getLatestChangeAbits();

    if (!changeAbits || changeAbits.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No changeAbits found" });
    }

    return res.status(200).json({ status: true, changeAbits });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

module.exports = {
  createChangeAbit,
  getAllChangeAbits,
  getChangeAbitById,
  updateChangeAbit,
  deleteChangeAbit,
  latestChangeAbits,
};
