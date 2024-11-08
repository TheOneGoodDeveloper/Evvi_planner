const connection = require("../Model/DB_connection.js");

class BlogModel {
  static async createBlog(title, content,category, blog_image,thumbnail, author, metaKeywords, metaDescription) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO blogs (blog_title, blog_body, blog_category, blog_image, blog_thumbnail, blog_author, blog_meta_keywords, blog_meta_description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        query,
        [title, content,category, blog_image, thumbnail, author, metaKeywords, metaDescription],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
  

  static async getAllBlogs() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM blogs";
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static async getBlogById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM blogs WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);

        // Update visitors count after retrieving the blog
        const updateVisitorsQuery =
          "UPDATE blogs SET blog_visitors_count = blog_visitors_count + 1 WHERE id = ?";
        connection.query(updateVisitorsQuery, [id], (updateErr) => {
          if (updateErr) return reject(updateErr);
          resolve(results);
        });
      });
    });
  }

  static async updateBlog(
    id,
    title,
    body,
    image,
    thumbnail,
    author,
    metaKeywords,
    metaDescription
  ) {
    console.log(body);
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE blogs SET blog_title = ?, blog_body = ?, blog_image = ?, blog_thumbnail = ?, blog_author = ?, blog_meta_keywords = ?, blog_meta_description = ? WHERE id = ?";
      connection.query(
        query,
        [title, body, image, thumbnail, author, metaKeywords, metaDescription, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static async deleteBlog(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM blogs WHERE id = ?";
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getLatestBlog() {
    const query = "SELECT * FROM blogs ORDER BY blog_date DESC LIMIT 4";
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = BlogModel;
