// models/Discovery.js
const connection = require("./DB_connection.js"); // MySQL connection

class Discovery {
  static async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO discovery (name, email, number, age, discovery_assessment, discovery_date, slots)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        query,
        [
          data.name,
          data.email,
          data.number,
          data.age,
          data.selectedAssessment,
          data.selectDate,
          data.slots,
        ],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM discovery`;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM discovery WHERE id = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  static async updateById(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE discovery 
        SET name = ?, email = ?, number = ?, age = ?, discovery_assessment = ?, discovery_date = ?, slots = ?
        WHERE id = ?
      `;
      connection.query(
        query,
        [
          data.name,
          data.email,
          data.number,
          data.age,
          data.selectedAssessment,
          data.selectDate,
          data.slots,
          id,
        ],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
  static async getByDate(selectDate,slot) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM discovery WHERE selectDate = ?`;
      db.query(query, [selectDate], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  static async deleteById(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM discovery WHERE id = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = Discovery;
