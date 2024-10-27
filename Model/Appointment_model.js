// appointmentModel.js
const db = require('../Model/DB_connection'); // Database connection file

const Appointment = {
    create: (data, callback) => {
        const sql = `INSERT INTO appointments (name, email, number, age, assessmentType, selectDate, slot, paymentDetails ) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
            data.name,
            data.email,
            data.number,
            data.age,
            data.selectedAssessment,
            data.selectDate,
            data.slots,
            data.paymentDetails

            // data.uploadImg
        ], (error, results) => {
            // if (error) {
            //     console.error('Database error:', error); // Log the error here
            // }
            callback(error, results);
        });
    },


    getAll: (callback) => {
        const sql = 'SELECT * FROM appointments';
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = 'SELECT * FROM appointments WHERE id = ?';
        db.query(sql, [id], callback);
    },

    update: (id, data, callback) => {
        const sql = `UPDATE appointments SET name = ?, email = ?, number = ?, age = ?, assessmentType = ?, selectDate = ?, 
                     paymentMethod = ?, paymentDetails = ?, slot = ? WHERE id = ?`;
        db.query(sql, [data.name, data.email, data.number, data.age, data.assessmentType, data.selectData, data.paymentMethod, data.paymentDetails, data.uploadImg, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM appointments WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Appointment;