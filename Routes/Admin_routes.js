// Node_modules
const express = require("express");
const AdminRoute = express.Router();

// Controllers
const {
  authMiddleware,
  adminLogin,
} = require("../Controller/Admin_controller.js");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../Controller/Category_controller.js");
// const {} = require("../Controller/Customer_controller.js")

// user Api's
AdminRoute.post("/login", adminLogin);
// Single file upload with field name 'image'
// AdminRoute.post("/getAllCustomer")

module.exports = AdminRoute;
