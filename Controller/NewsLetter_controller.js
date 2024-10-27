const Newsletter = require("../Model/NewsLetter_model.js");
const Subscription = require("../Model/Subscriber_model.js");
const EmailHistory = require("../Model/EmailHistory_model.js");
// const { subscribe } = require("../Routes/message_route");
const {sendBulkMail} = require("../Mailsend/mailsendto.js")
// Create a new newsletter
const createNewsletter = async (req, res) => {
  const { title, content, image, status } = req.body;
  try {
    const result = await Newsletter.createNewsletter({
      title,
      content,
      image,
      status: "sent",
    });
    return res
      .status(201)
      .json({ message: "Newsletter created successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create newsletter", details: error.message });
  }
};

// Get a specific newsletter by ID
const getNewsletterById = async (req, res) => {
  const { id } = req.params;
  try {
    const newsletter = await Newsletter.getNewsletterById(id);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    return res.status(200).json({ newsletter });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve newsletter", details: error.message });
  }
};

// Get all newsletters
const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.getAllNewsletters();
    return res.status(200).json({ newsletters });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve newsletters",
      details: error.message,
    });
  }
};

// Update a newsletter
const updateNewsletter = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, status } = req.body;
  try {
    const result = await Newsletter.updateNewsletter(id, {
      title,
      content,
      image,
      status,
    });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Newsletter not found or no changes made" });
    }
    res
      .status(200)
      .json({ message: "Newsletter updated successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update newsletter", details: error.message });
  }
};

// Delete a newsletter
const deleteNewsletter = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Newsletter.deleteNewsletter(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete newsletter", details: error.message });
  }
};


const sendNewsletterEmail = async (subscriberEmail, newsletter) => {
  const emailContent = `
      <h1>${newsletter.title}</h1>
      <p>${newsletter.content}</p>
      ${
        newsletter.image
          ? `<img src="${newsletter.image}" alt="Newsletter Image" />`
          : ""
      }
    `;

  try {
    await sendBulkMail({
      to: subscriberEmail,
      subject: newsletter.title,
      html: emailContent,
    });
    console.log(`Email sent to ${subscriberEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${subscriberEmail}:`, error.message);
    throw error; // Propagate error if needed for error tracking
  }
};


const sendNewsLetterToSubscribers = async (req, res) => {
  const { newsletterId } = req.body;

  try {
    // Fetch the newsletter content
    const newsletter = await Newsletter.getNewsletterById(newsletterId);

    if (!newsletter) {
      return res.status(404).json({ status: false, message: "Newsletter not found" });
    }

    // Get all subscribers
    Subscription.getAllSubscriptions(async (err, subscribers) => {
      if (err) {
        return res.status(500).json({ status: false, message: "Error fetching subscribers" });
      }

      if (!subscribers || subscribers.length === 0) {
        return res.status(404).json({ status: false, message: "No subscribers found" });
      }

      // Send the newsletter to all subscribers using Promise.all
      try {
        await Promise.all(
          subscribers.map(async (subscriber) => {
            try {
              await sendNewsletterEmail(subscriber.email, newsletter);

              // Create email history record on successful send
              await EmailHistory.createEmailHistory(
                newsletterId,
                subscriber.email,
                'Sent'
              );
            } catch (error) {
              // Log error in email history
              await EmailHistory.createEmailHistory(
                newsletterId,
                subscriber.email,
                'Failed',
                error.message
              );
            }
          })
        );

        return res.status(200).json({ status: true, message: "Bulk mail sent to subscribers" });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Error sending emails",
          details: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error processing newsletter",
      details: error.message,
    });
  }
};



module.exports = {
  createNewsletter,
  updateNewsletter,
  getAllNewsletters,
  getNewsletterById,
  deleteNewsletter,
  sendNewsLetterToSubscribers,
};