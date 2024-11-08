const Discovery = require("../Model/Discovery_model.js");

const createDiscovery = async (req, res) => {
  try {
    const { name, email, number, age, selectedAssessment, selectDate, slots } =
      req.body;
    const data = {
      name,
      email,
      number,
      age,
      selectedAssessment,
      selectDate,
      slots,
    };
    if (
      !name ||
      !email ||
      !number ||
      !age ||
      !selectedAssessment ||
      !selectDate ||
      !slots
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Please Fill The Required Fields" });
    }
    const result = await Discovery.create(data);
    res
      .status(201)
      .json({
        status: true,
        message: "Discovery Appointment created successfully",
        result,
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Error creating discovery", error });
  }
};

const getAllDiscoveries = async (req, res) => {
  try {
    const results = await Discovery.getAll();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving discoveries", error });
  }
};

const getDiscoveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Discovery.getById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Discovery not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving discovery", error });
  }
};

const updateDiscoveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, age, selectedAssessment, selectDate, slots } =
      req.body;
    const data = {
      name,
      email,
      number,
      age,
      selectedAssessment,
      selectDate,
      slots,
    };

    const result = await Discovery.updateById(id, data);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Discovery updated successfully" });
    } else {
      res.status(404).json({ message: "Discovery not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating discovery", error });
  }
};

const deleteDiscoveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Discovery.deleteById(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Discovery deleted successfully" });
    } else {
      res.status(404).json({ message: "Discovery not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting discovery", error });
  }
};

module.exports = {
  createDiscovery,
  getAllDiscoveries,
  getDiscoveryById,
  updateDiscoveryById,
  deleteDiscoveryById,
};
