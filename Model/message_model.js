const db = require("../Model/DB_connection"); // Import the database connection

// Function to insert a new message
const insertMessage = (name, email, message, number, type) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO contact_us (name, email, message, number, type, date) VALUES (?, ?, ?, ?, ?, NOW())`;
    db.query(query, [name, email, message, number, type], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to retrieve all messages
const getAllMessages = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM  contact_us`;
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const updateMessage = (id, name, email, message, number, type) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE contact_us SET name = ?, email = ?, message = ?, number = ?, type = ? WHERE id = ?`;
    db.query(query, [name, email, message, number, type, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to delete a message by ID
const deleteMessage = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM contact_us WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const getMessagesByType = (type) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM contact_us WHERE type = ?`;
    db.query(query, [type], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { insertMessage, getAllMessages,updateMessage,deleteMessage };
