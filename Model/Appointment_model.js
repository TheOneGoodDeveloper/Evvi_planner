const db = require("../Model/DB_connection"); // Database connection file

const Appointment = {
  create: (data) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO appointments (name, email, number, location, assessmentType,otherAssessement, selectDate, slot, paymentDetails,isConsentChecked,isTermsChecked) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;
      db.query(
        sql,
        [
          data.name,
          data.email,
          data.number,
          data.location,
          data.selectedAssessment,
          data.otherAssessement,
          data.selectDate,
          data.slots,
          data.paymentDetails,
          data.isConsentChecked,
          data.isTermsChecked,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM appointments";
      db.query(sql, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM appointments WHERE id = ?";
      db.query(sql, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE appointments SET name = ?, email = ?, number = ?, age = ?, assessmentType = ?, selectDate = ?, 
                         paymentMethod = ?, paymentDetails = ?, slot = ? WHERE id = ?`;
      db.query(
        sql,
        [
          data.name,
          data.email,
          data.number,
          data.age,
          data.assessmentType,
          data.selectDate,
          data.paymentMethod,
          data.paymentDetails,
          id,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM appointments WHERE id = ?";
      db.query(sql, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },
  getBookedSlots: (selectDate) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT slot FROM appointments WHERE selectDate = ?";
      db.query(sql, [selectDate], (error, results) => {
        if (error) {
          return reject(error);
        }
        // Return an array of booked slots
        resolve(results.map(row => row.slot));
      });
    });
  },
  
};


module.exports = Appointment;
