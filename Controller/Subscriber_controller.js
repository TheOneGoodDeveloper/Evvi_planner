const Subscription = require("../Model/Subscriber_model.js");
const { sendMail } = require("../Mailsend/mailsendto.js");


// Subscribe to newsletter
const subscribe = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  Subscription.subscribeUser(email, async (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: false, error: "Failed to subscribe" });

    // await sendMail(email, subject, message, (mailErr, mailInfo) => {
    //   if (mailErr) {
    //     return res.status(500).json({
    //       status: false,
    //       message: "Subscription successful, but failed to send email",
    //     });
    //   }

      return res.status(200).json({
        status: true,
        message: "Successfully subscribed and email sent"
        // info: mailInfo,
      });
    });
  };
// };

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  const { email } = req.body;

  await Subscription.unsubscribeUser(email, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: false, message: "Failed to unsubscribe" });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Email not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Successfully unsubscribed" });
  });
};

// Get all subscriptions (optional for admin)
const getAllSubscriptions = (req, res) => {
  Subscription.getAllSubscriptions((err, results) => {
    if (err)
      return res
        .status(500)
        .json({ status: false, message: "Failed to retrieve subscriptions" });
    return res.status(200).json({ status: true, results });
  });
};

// Delete a subscription
const deleteSubscription = (req, res) => {
  const { email } = req.body;

  Subscription.deleteSubscription(email, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: false, message: "Failed to delete subscription" });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Email not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Subscription deleted successfully" });
  });
};

// const sendNewsLetterToSubscribers = async (req, res) => {
//   const{newsLetterId} = req.body

//   Subscription.getAllSubscriptions(async (err, results) => {
//     if (results) {
//       await sendMail(results);
//       res
//         .status(200)
//         .json({ status: false, message: "Bulk Mail Send For Subscribers " });
//     } else {
//       return res
//         .status(404)
//         .json({ status: false, message: "Error In Email Send" });
//     }
//   });
// };

module.exports = {
  subscribe,
  unsubscribe,
  deleteSubscription,
  getAllSubscriptions,
  // sendNewsLetterToSubscribers,
};
