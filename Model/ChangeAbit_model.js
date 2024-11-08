const connection = require("../Model/DB_connection.js");

class ChangeAbitModel {
  // CREATE ChangeAbit entry
  static async createChangeAbit({
    title,
    content,
    category,
    changeAbitImage,
    changeAbitThumbnail,
    author,
    metaKeywords,
    metaDescription,
  }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Changeabit (changeAbit_title, changeAbit_content, changeAbit_category, changeAbit_image, changeAbit_thumbnail, changeAbit_author, changeAbit_meta_keywords, changeAbit_meta_description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        query,
        [
          title,
          content,
          category,
          changeAbitImage,
          changeAbitThumbnail,
          author,
          metaKeywords,
          metaDescription,
        ],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  // READ all ChangeAbit entries
  static async getAllChangeAbits() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Changeabit";
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // READ a ChangeAbit entry by ID
  static async getChangeAbitById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Changeabit WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);

        // Update visit count after retrieving the entry
        const updateVisitCountQuery =
          "UPDATE Changeabit SET changeAbit_visit_count = changeAbit_visit_count + 1 WHERE id = ?";
        connection.query(updateVisitCountQuery, [id], (updateErr) => {
          if (updateErr) return reject(updateErr);
          resolve(results[0]);
        });
      });
    });
  }

  // UPDATE ChangeAbit entry
  static async updateChangeAbit(id, data) {
    const {
      title,
      content,
      category,
      changeAbitImage,
      thumbnail,
      author,
      metaKeywords,
      metaDescription,
    } = data;

    return new Promise((resolve, reject) => {
      const query =
        "UPDATE Changeabit SET changeAbit_title = ?, changeAbit_content = ?, changeAbit_category = ?, changeAbit_image = ?, changeAbit_thumbnail = ?, changeAbit_author = ?, changeAbit_meta_keywords = ?, changeAbit_meta_description = ? WHERE id = ?";
      connection.query(
        query,
        [
          title,
          content,
          category,
          changeAbitImage,
          thumbnail,
          author,
          metaKeywords,
          metaDescription,
          id,
        ],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }


  // DELETE ChangeAbit entry
  static async deleteChangeAbit(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM Changeabit WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // GET latest ChangeAbit entries
  static async getLatestChangeAbits() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Changeabit ORDER BY createdAt DESC LIMIT 4";
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = ChangeAbitModel;
