const connection = require("../Model/DB_connection.js"); // Assuming your DB connection is in a separate file

class Newsletter {
  // Create a new newsletter entry
  static async createNewsletter({ title, content, image, status }) {
    const insertQuery = `
      INSERT INTO newsletter (title, content, image, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    return new Promise((resolve, reject) => {
      connection.query(insertQuery, [title, content, image, status], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Get a specific newsletter by ID
  static async getNewsletterById(id) {
    const query = 'SELECT * FROM newsletter WHERE id = ?';
    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  // Get all newsletters
  static async getAllNewsletters() {
    const query = 'SELECT * FROM newsletter';
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Update a newsletter
  static async updateNewsletter(id, { title, content, image, status }) {
    const updateQuery = `
      UPDATE newsletter
      SET title = ?, content = ?, image = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      connection.query(updateQuery, [title, content, image, status, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Delete a newsletter
  static async deleteNewsletter(id) {
    const deleteQuery = 'DELETE FROM newsletter WHERE id = ?';
    return new Promise((resolve, reject) => {
      connection.query(deleteQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = Newsletter;
