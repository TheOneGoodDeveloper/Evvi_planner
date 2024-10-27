const MessageModel = require("../Model/message_model");
const { sendMail } = require("../Mailsend/mailsendto.js");

// Controller to handle inserting a new message
const createdata = async (req, res) => {
  const { name, email, message, number, type } = req.body;
  console.log(req.body);
  if (!name || !email || !message || !number || !type) {
    return res
      .status(400)
      .json({ status: false, message: "Please enter the Required" });
  }

  try {
    const result = await MessageModel.insertMessage(
      name,
      email,
      message,
      number,
      type
    );
    await sendMail(req.body);
    return res
      .status(201)
      .json({
        status: true,
        message: "Message inserted successfully",
        id: result.insertId,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, error: "Error inserting message",err:err.message });
  }
};

// Controller to get all messages
const getdata = async (req, res) => {
  try {
    const messages = await MessageModel.getAllMessages();
    return res.status(200).json(messages);
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Error retrieving messages" });
  }
};
// Controller to update a message
const updatedata = async (req, res) => {
  const { id } = req.params;
  const { name, email, message, number, type } = req.body;

  if (!id || !name || !email || !message || !number || !type) {
    return res
      .status(400)
      .json({ status: false, message: "Please provide all required fields" });
  }

  try {
    const result = await MessageModel.updateMessage(
      id,
      name,
      email,
      message,
      number,
      type
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Message not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Message updated successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, error: "Error updating message" });
  }
};

// Controller to delete a message
const deletedata = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: "Message ID required" });
  }

  try {
    const result = await MessageModel.deleteMessage(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Message not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Message deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, error: "Error deleting message" });
  }
};
// Controller to get messages by type
const getMessagesByType = async (req, res) => {
  const { type } = req.params;

  try {
    const messages = await MessageModel.getMessagesByType(type);
    if (messages.length === 0) {
      return res
        .status(404)
        .json({
          status: false,
          message: "No messages found for the specified type",
        });
    }
    return res.status(200).json(messages);
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Error retrieving messages by type" });
  }
};

module.exports = {
  createdata,
  getdata,
  updatedata,
  deletedata,
  getMessagesByType,
};
