const connection = require("../Model/DB_connection.js");

class SafetyModel {
  // Create a new safety record
  static async createSafety(
    safetytitle, safetyBody, safety_category, safetyImage, safetyThumbnail, safetyAuthor, metaKeywords, metaDescription
  ) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO safety (safety_title, safety_body, safety_category, safety_image, safety_thumbnail, safety_author, safety_meta_keywords, safety_meta_description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        query,
        [safetytitle, safetyBody, safety_category, safetyImage, safetyThumbnail, safetyAuthor, metaKeywords, metaDescription],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
  

  // Get all safety records
  static async getAllSafety() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM safety";
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Get a safety record by ID and increment visitors count
  static async getSafetyById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM safety WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);

        // Update visitors count after retrieving the safety record
        const updateVisitorsQuery = "UPDATE safety SET safety_visitors_count = safety_visitors_count + 1 WHERE id = ?";
        connection.query(updateVisitorsQuery, [id], (updateErr) => {
          if (updateErr) return reject(updateErr);
          resolve(results);
        });
      });
    });
  }

  // Update an existing safety record
  static async updateSafety(id, safetyTitle, safetyBody,safety_category, safetyImage, safetyThumbnail, safetyAuthor, metaKeywords, metaDescription) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE safety SET 
          safety_title = ?, 
          safety_body = ?,
          safety_category = ?, 
          safety_image = ?, 
          safety_thumbnail = ?, 
          safety_author = ?, 
          safety_meta_keywords = ?, 
          safety_meta_description = ? 
        WHERE id = ?
      `;
      connection.query(
        query,
        [safetyTitle, safetyBody,safety_category, safetyImage, safetyThumbnail, safetyAuthor, metaKeywords, metaDescription, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  // Delete a safety record by ID
  static async deleteSafety(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM safety WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Get the latest safety records (e.g., limit to 4 for recent entries)
  static getLatestSafety() {
    const query = "SELECT * FROM safety ORDER BY safety_date DESC LIMIT 4";
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = SafetyModel;
