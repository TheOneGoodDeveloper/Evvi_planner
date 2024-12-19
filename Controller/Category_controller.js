const Category = require("../Model/Category_model.js");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const id = await Category.create(name);
    return res.status(201).json({ message: "Category created", id });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create category" });
  }
};

// Update an existing category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    await Category.update(id, name);
    res.json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.delete(id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// Export functions
module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
