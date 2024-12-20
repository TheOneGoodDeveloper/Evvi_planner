const connection = require('../Database/DB_connection.js'); // Import database connection

class SubCategory {
    static async getAll() {
        return await connection.promise().query('SELECT * FROM sub_category');
    }

    static async getById(id) {
        return await connection.promise().query('SELECT * FROM sub_category WHERE id = ?', [id]);
    }

    static async create(category_id, name) {
        return await connection.promise().query(
            'INSERT INTO sub_category (category_id, name) VALUES (?, ?)',
            [category_id, name]
        );
    }

    static async  update(id, name) {
        return await connection.promise().query(
            'UPDATE sub_category SET name = ? WHERE id = ?',
            [name, id]
        );
    }

    static async  delete(id) {
        return await connection.promise().query('DELETE FROM sub_category WHERE id = ?', [id]);
    }
}

module.exports = SubCategory;
