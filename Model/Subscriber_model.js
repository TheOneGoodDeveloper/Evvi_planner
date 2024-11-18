const connection = require('../Model/DB_connection.js');

class Subscription {
  // Subscribe a user
  static async subscribeUser(email, callback) {
    // Check if email is null, undefined, or an empty string
    if (!email || email.trim() === '') {
      return callback(new Error("Invalid email: cannot be null or empty"));
    }
  
    const checkQuery = 'SELECT * FROM newsletter_subscribers WHERE email = ?';
  
    connection.query(checkQuery, [email], (err, result) => {
      if (err) return callback(err);
  
      if (result.length > 0) {
        // Update existing subscription
        const updateQuery = 'UPDATE newsletter_subscribers SET status = ?, subscription_date = NOW() WHERE email = ?';
        connection.query(updateQuery, ['active', email], callback);
      } else {
        // Insert new subscription
        const insertQuery = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';
        connection.query(insertQuery, [email], callback);
      }
    });
  }
  

  // Unsubscribe a user
  static async unsubscribeUser(email, callback) {
    const updateQuery = 'UPDATE newsletter_subscribers SET status = ? WHERE email = ?';
    connection.query(updateQuery, ['unsubscribed', email], callback);
  }

  // Get all subscriptions (optional for admin)
  static async getAllSubscriptions (callback) {
    const query = 'SELECT * FROM newsletter_subscribers';
    connection.query(query, callback);
  }

  // Delete a subscription
  static async deleteSubscription(email, callback) {
    const deleteQuery = 'DELETE FROM newsletter_subscribers WHERE email = ?';
    connection.query(deleteQuery, [email], callback);
  }
}

module.exports = Subscription;


