const connection = require("../Database/DB_connection.js"); // MySQL connection pool

class CategoryModel {
  static async getAllCategory() {
    const query = "SELECT id, name FROM categories WHERE is_deleted = 0";
    try {
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  static async create(name) {
    const query = "INSERT INTO categories (name) VALUES (?)";
    try {
      const [result] = await connection.query(query, [name]);
      return result.insertId; // Return the new category ID
    } catch (error) {
      throw new Error("Error creating category");
    }
  }

  static async update(id, name) {
    const query =
      "UPDATE categories SET name = ? WHERE id = ? AND is_deleted = 0";
    try {
      const [result] = await connection.query(query, [name, id]);
      if (result.affectedRows === 0) {
        throw new Error("Category not found or already deleted");
      }
    } catch (error) {
      throw new Error("Error updating category");
    }
  }

  static async delete(id) {
    const query =
      "UPDATE categories SET is_deleted = 1 WHERE id = ? AND is_deleted = 0";
    try {
      const [result] = await connection.query(query, [id]);
      if (result.affectedRows === 0) {
        throw new Error("Category not found or already deleted");
      }
    } catch (error) {
      throw new Error("Error deleting category");
    }
  }
}

module.exports = CategoryModel;
