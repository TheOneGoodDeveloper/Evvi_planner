
const Appointment = require('../Model/Appointment_model.js');
const sendEmailforAppointments = require('../Mailsend/mailsendto.js'); // Import the email sending function

const AppointmentController = {
    // Create a new appointment
    createAppointment: (req, res) => {
        const appointmentData = {
            name: req.body.name,
            email: req.body.email,  // User's email
            number: req.body.number,
            age: req.body.age,
            selectedAssessment: req.body.assessmentType,
            selectDate: req.body.selectDate, // Ensure this is in the request body
            // paymentMethod: req.body.paymentMethod,
            paymentDetails: req.body.paymentDetails,
            slots: req.body.slots
            // uploadImg: req.file ? req.file.path : null // Assuming you're using multer for file upload
        };
        console.log(req.body);
        if(!appointmentData.name||!appointmentData.email||!appointmentData.paymentDetails){
            return res.status(400).json({status:false,message:"please enter the requried fields"})
        }

        // Create appointment in the database
        Appointment.create(appointmentData, (error, results) => {
            if (error) {
                return res.status(500).json({ status:false,message: 'Error creating appointment', error });
            }

            // Prepare data for the emails
            const clientRecipient = "feedback@enrichminds.co.in"; 
            const userRecipient = req.body.email; // Send to user

            // Send to client (replace with actual client email)
            
            const subjectClient = "New Appointment Received";
            const subjectUser = "Appointment Confirmation";

            // Function to send emails and log errors
            const sendEmails = async () => {
                try {
                    await sendEmailforAppointments(clientRecipient,userRecipient, subjectUser, appointmentData, 'userside_style');
                    console.log('User email sent successfully.');
                } catch (error) {
                    console.error('Error sending user email:', error);
                }

                try {
                    await sendEmail(userRecipient,clientRecipient, subjectClient, appointmentData, 'clientside_style');
                    console.log('Client email sent successfully.');
                } catch (error) {
                    console.error('Error sending client email:', error);
                }
            };

            // Send both emails
            sendEmails().then(() => {
                // Respond with success after sending emails
                res.status(201).json({
                    message: 'Appointment created successfully and emails sent.'
                });
            }).catch(err => {
                // Handle any errors from sendEmails
                console.error('Error in sending emails:', err);
                res.status(201).json({
                    message: 'Appointment created successfully, but there was an issue sending emails.'
                });
            });
        });
    },


    // Get all appointments
    getAppointments: (req, res) => {
        Appointment.getAll((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json(results);
        });
    },

    // Get a single appointment by ID
    getAppointmentById: (req, res) => {
        const id = req.params.id;
        Appointment.getById(id, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.status(200).json(results[0]);
        });
    },

    // Update an existing appointment
    updateAppointment: (req, res) => {
        const id = req.params.id;
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            age: req.body.age,
            assessmentType: req.body.assessmentType,
            selectData: req.body.selectData,
            paymentMethod: req.body.paymentMethod,
            paymentDetails: req.body.paymentDetails,
            uploadImg: req.file ? req.file.path : req.body.uploadImg // If no new file uploaded, keep the existing path
        };

        Appointment.update(id, updatedData, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.status(200).json({ message: 'Appointment updated successfully' });
        });
    },

    // Delete an appointment
    deleteAppointment: (req, res) => {
        const id = req.params.id;
        Appointment.delete(id, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.status(200).json({ message: 'Appointment deleted successfully' });
        });
    }
};

module.exports = AppointmentController;