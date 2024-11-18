// node_modules
const express = require("express");
const UserRoute = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Assets/payments/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

//Controllers
const {
  createdata,
  getdata,
  updatedata,
  deletedata,
  getMessagesByType,
} = require("../Controller/message_controller.js");
const {
  getAllBlogs,
  latestBlogs,
  getBlogById,
} = require("../Controller/Blog_controller.js");
const {
  createComment,
  deleteComment,
  getCommentByBlogId,
} = require("../Controller/Comment_controller.js");
const {
  requestPasswordReset,
  resetPassword,
} = require("../Controller/Auth_controller.js");
const {
  subscribe,
  unsubscribe,
  deleteSubscription,
  getAllSubscriptions,
  // sendNewsLetterToSubscribers,
} = require("../Controller/Subscriber_controller.js");
const {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAppointments,
} = require("../Controller/Appointement_controller.js");
const {
  createReply,
  getReplies,
} = require("../Controller/Reply_controller.js");
const {
  createDiscovery,
  getAllDiscoveries,
  getDiscoveryById,
  updateDiscoveryById,
  deleteDiscoveryById,
} = require("../Controller/Discovery_controller.js");
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



// user Api's
UserRoute.get("/getAllBlogs", getAllBlogs);
UserRoute.get("/getBlogById/:id", getBlogById);
UserRoute.get("/latestBlogs", latestBlogs);

UserRoute.get("/getallChangeAbitList",getAllChangeAbits)
UserRoute.get("/getchangeAbit/:id",getChangeAbitById)

UserRoute.get("/getAllSafetyList",getAllSafety);
UserRoute.get("/getSafety/:id",getSafetyById)
UserRoute.get("unsubscribeToNewsLetter",unsubscribe)
UserRoute.post("/createComments", createComment);
UserRoute.get("/getCommentByBlogId/:id", getCommentByBlogId);
UserRoute.post("/auth/requestPasswordReset", requestPasswordReset);
UserRoute.post("/auth/resetPassword/:token", resetPassword);
UserRoute.post("/replyToComment", createReply);
UserRoute.post("/getReplies", getReplies);
UserRoute.post("/subscribe", subscribe);
UserRoute.post("/appointments", upload.single("file"), createAppointment);
UserRoute.post("/registerDiscovery",createDiscovery);

module.exports = UserRoute;
