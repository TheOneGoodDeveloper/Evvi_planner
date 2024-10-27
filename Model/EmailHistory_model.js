const connection = require('../Model/DB_connection.js');

class EmailHistory {
  // Create a new email history record
  static createEmailHistory(recipientEmail, newsletterId, sendStatus) {
    const query = 'INSERT INTO email_send_history (newsletter_id, recipient_email, send_status, send_at) VALUES (?, ?, ?, NOW())';
    const params = [newsletterId, recipientEmail, sendStatus];

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error("Error creating email history:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Read all email history records
  static getAllEmailHistories() {
    const query = 'SELECT * FROM email_send_history ORDER BY send_at DESC';

    return new Promise((resolve, reject) => {
      connection.query(query, (err, rows) => {
        if (err) {
          console.error("Error fetching email histories:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Read a specific email history record by ID
  static getEmailHistoryById(id) {
    const query = 'SELECT * FROM email_send_history WHERE id = ?';

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, rows) => {
        if (err) {
          console.error("Error fetching email history by ID:", err);
          return reject(err);
        }
        resolve(rows[0]); // Return the first row found
      });
    });
  }

  // Update an existing email history record
  static updateEmailHistory(id, sendStatus) {
    const query = 'UPDATE email_send_history SET send_status = ? WHERE id = ?';
    const params = [sendStatus, id];

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error("Error updating email history:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Delete an email history record by ID
  static deleteEmailHistory(id) {
    const query = 'DELETE FROM email_send_history WHERE id = ?';

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err, result) => {
        if (err) {
          console.error("Error deleting email history:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = EmailHistory;
