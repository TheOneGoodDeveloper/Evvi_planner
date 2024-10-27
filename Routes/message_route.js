const express = require("express");
const messageController = require("../Controller/message_controller");
const mailController = require("../Mailsend/mailsendto");
const subscriber_controller = require("../Controller/Subscriber_controller.js")
const Newsletter = require("../Controller/NewsLetter_controller.js");


const router = express.Router();

// Define routes
router.post("/createmessages", messageController.createdata); // Route to insert a new message
router.get("/listmessages", messageController.getdata); // Route to get all messages
router.post("/updateMessages", messageController.updatedata);
router.delete("/deleteMessage", messageController.deletedata);
router.get("/getMessagesByType/:type", messageController.getMessagesByType);
router.post("/subscribeNewsLetter",subscriber_controller.subscribe)
router.post("/sendBulkMail",Newsletter.sendNewsLetterToSubscribers)

// router.post('/send-mail', mailController.sendMail);

module.exports = router;
