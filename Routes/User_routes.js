// node_modules
const express = require("express");
const UserRoute = express.Router();

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
}= require("../Controller/Subscriber_controller.js")
const AppointmentController = require("../Controller/Appointement_controller.js") 
const {createReply,getReplies} = require("../Controller/Reply_controller.js")
// user Api's
UserRoute.get("/getAllBlogs", getAllBlogs);
UserRoute.get("/getBlogById/:id", getBlogById);
UserRoute.get("/latestBlogs", latestBlogs);
UserRoute.post("/createComments", createComment);
UserRoute.get("/getCommentByBlogId/:id", getCommentByBlogId);
UserRoute.post("/auth/requestPasswordReset", requestPasswordReset);
UserRoute.post("/auth/resetPassword/:token", resetPassword);
UserRoute.post("/replyToComment",createReply)
UserRoute.post ("/getReplies",getReplies);
UserRoute.post("/subscribe",subscribe)
UserRoute.post('/appointments', AppointmentController.createAppointment);
module.exports = UserRoute;
