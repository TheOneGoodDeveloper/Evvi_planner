const Appointment = require("../Model/Appointment_model.js");
const { sendEmailforAppointments } = require("../Mailsend/mailsendto.js");
const fs = require("fs");
const dotenv = require("dotenv")
const { createAppointmentICS } = require("../utils/icsGenerator.js");
dotenv.config();

// Create a new appointment
const createAppointment = async (req, res) => {
  const {
    name,
    email,
    number,
    location,
    selectedAssessment,
    otherAssessement,
    selectDate,
    slots,
    isConsentChecked,
    isTermsChecked,
  } = req.body;
  const paymentDetails = req.file.filename;
  console.log(req.body);
  if (!name || !email || !paymentDetails) {
    return res
      .status(400)
      .json({ status: false, message: "Please enter the required fields" });
  }

  const appointmentData = {
    name,
    email,
    number,
    location,
    selectedAssessment: selectedAssessment,
    otherAssessement: otherAssessement || "NULL",
    selectDate,
    paymentDetails,
    slots,
    isConsentChecked,
    isTermsChecked,
  };

  try {
    const icsFilePath = await createAppointmentICS(appointmentData);
    const results = await Appointment.create(appointmentData);
    console.log(icsFilePath);
    // Send emails
    // const clientRecipient = "feedback@enrichminds.co.in";
    // const clientRecipient = process.env.MAIL_APP;
    const clientRecipient = "appointment@enrichminds.co.in"
    const userRecipient = email;
    const subjectClient = "New Appointment Received";
    const subjectUser = "Appointment Confirmation";
    let usermail = "";
    await Promise.all([
      sendEmailforAppointments(
        clientRecipient,
        userRecipient,
        subjectUser,
        appointmentData,
        "userside_style",
        icsFilePath
      ),
      (sendEmailforAppointments(
        userRecipient,
        clientRecipient,
        subjectClient,
        appointmentData,
        "clientside_style",
        icsFilePath
      )),
    ]);
    // if (usermail) {
    //   fs.unlinkSync(icsFilePath);
    // }
    return res
      .status(201)
      .json({ message: "Appointment created successfully and emails sent." });
  } catch (error) {
    console.error("Error creating appointment or sending emails:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Error creating appointment or sending emails",
        error,
      });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const results = await Appointment.getAll();
    res.status(200).json(results.reverse());
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const results = await Appointment.getById(id);
    if (results.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Update an existing appointment
const updateAppointment = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    email,
    number,
    age,
    assessmentType,
    selectDate,
    paymentMethod,
  } = req.body;
  const paymentDetails = req.file ? req.file.path : req.body.paymentDetails;

  const updatedData = {
    name,
    email,
    number,
    age,
    assessmentType,
    selectDate,
    paymentMethod,
    paymentDetails,
  };

  try {
    const results = await Appointment.update(id, updatedData);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const id = req.params.id;
  try {
    const results = await Appointment.delete(id);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
      const { date } = req.body;

      if (!date) {
          return res.status(400).json({ error: 'Date is required' });
      }

      // Predefined slots
      const predefinedSlots = [
          '6.00pm - 7.00pm',
          '7.00pm - 8.00pm',
          '8.00pm - 9.00pm',
      ];

      // Get booked slots for the given date
      const bookedSlots = await Appointment.getBookedSlots(date);

      // Filter out booked slots
      const availableSlots = predefinedSlots.filter(
          (slot) => !bookedSlots.includes(slot)
      );
        // console.log(availableSlots);
      return res.status(200).json({
          success: true,
          date: date,
          availableSlots,
      });
  } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({
          success: false,
          message: 'An error occurred while fetching available slots',
      });
  }
};

module.exports = {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAppointments,
  getAvailableSlots
};
