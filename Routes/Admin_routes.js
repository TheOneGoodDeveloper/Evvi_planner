// Node_modules
const express = require("express");
const AdminRoute = express.Router();

// image upload using multer
const upload = require("../Middleware/multer_config.js");
const {changeAbitUpload} = require("../Middleware/changeAbit_multer_config.js")
const {safetyUpload} = require("../Middleware/Safety_multer_config.js")

// Controllers
const {
  authMiddleware,
  adminLogin,
} = require("../Controller/Admin_controller.js");
const {
  createComment,
  deleteComment,
  getCommentByBlogId,
  getAllComments,
  hideComment,
  unhideComment,
} = require("../Controller/Comment_controller.js");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../Controller/Blog_controller.js");
const{
  createChangeAbit,
  getAllChangeAbits,
  getChangeAbitById,
  updateChangeAbit,
  deleteChangeAbit,
  latestChangeAbits,
} = require("../Controller/ChangeAbit_controller.js");
const {
  createSafety,
  getAllSafety,
  getSafetyById,
  updateSafety,
  deleteSafety,
  latestSafety,
} = require("../Controller/Safety_controller.js")
const {
  requestPasswordReset,
  resetPassword,
} = require("../Controller/Auth_controller.js");
const {
  getdata,
  updatedata,
  deletedata,
  getMessagesByType,
} = require("../Controller/message_controller.js");
const {
  createReply,
  getReplies,
  hideReply,
  unhideReply,
} = require("../Controller/Reply_controller.js");
const {
  deleteSubscription,
  getAllSubscriptions,
} = require("../Controller/Subscriber_controller.js");
const {
  createDiscovery,
  getAllDiscoveries,
  getDiscoveryById,
  updateDiscoveryById,
  deleteDiscoveryById,
} = require("../Controller/Discovery_controller.js");
const {
  createNewsletter,
  updateNewsletter,
  getAllNewsletters,
  getNewsletterById,
  deleteNewsletter,
  sendNewsLetterToSubscribers,
} = require("../Controller/NewsLetter_controller.js");
const {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAppointments,
  getAvailableSlots
} = require("../Controller/Appointement_controller.js");
// user Api's
AdminRoute.post("/login", adminLogin);
AdminRoute.post(
  "/createBlog",
  authMiddleware,
  upload,
  createBlog
); // Single file upload with field name 'image'

AdminRoute.get("/getAllBlogs", authMiddleware, getAllBlogs);

AdminRoute.get("/:id", authMiddleware, getBlogById);
AdminRoute.put(
  "/updateBlog",
  authMiddleware,
  upload,
  updateBlog
);
AdminRoute.delete("/deleteBlog/:id", authMiddleware, deleteBlog);
// ChangeAbit
AdminRoute.post("/createChangeAbit",authMiddleware,changeAbitUpload,createChangeAbit);
AdminRoute.put("/updateChangeAbit",authMiddleware,changeAbitUpload,updateChangeAbit);
AdminRoute.post("/getallChangeAbitList",authMiddleware,getAllChangeAbits)
AdminRoute.get("/getchangeAbit/:id",authMiddleware,getChangeAbitById)
AdminRoute.delete("/deleteChangeAbit/:id",authMiddleware,deleteChangeAbit);
// Safety Net
AdminRoute.post("/createSafety",authMiddleware,safetyUpload,createSafety)
AdminRoute.put("/updateSafety",authMiddleware,safetyUpload,updateSafety);
AdminRoute.post("/getAllSafetyList",authMiddleware,getAllSafety);
AdminRoute.get("/getSafety/:id",authMiddleware,getSafetyById)
AdminRoute.delete("/deleteSafety/:id",authMiddleware,deleteSafety);
// AdminRoute.
AdminRoute.post("/getAllAppointments",authMiddleware,getAppointments)
// reset password
AdminRoute.post("/requestPasswordReset", authMiddleware, requestPasswordReset);
AdminRoute.post("/reset-password", authMiddleware, resetPassword);
AdminRoute.post("/getleads", authMiddleware, getdata);
AdminRoute.post("/getAllComments", authMiddleware, getAllComments);
AdminRoute.post("/deleteComment", authMiddleware, deleteComment);
AdminRoute.post("/replyToComment", authMiddleware, createReply);
AdminRoute.post("/getAllReplies", authMiddleware, getReplies);
AdminRoute.post("/hideReply", authMiddleware, hideReply);
AdminRoute.post("/unhideReply", authMiddleware, unhideReply);
AdminRoute.post("/hideComment", authMiddleware, hideComment);
AdminRoute.post("/unhideComment", authMiddleware, unhideComment);
AdminRoute.post("/getAllSubscribers", authMiddleware, getAllSubscriptions);
AdminRoute.post("/createNewsletter", authMiddleware,createNewsletter);
AdminRoute.post("/sendBulkMail",authMiddleware,sendNewsLetterToSubscribers);
module.exports = AdminRoute;
