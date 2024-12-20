const connection = require('../Database/DB_connection.js'); // MySQL connection instance

class OrderModel {
    static async createOrder(userId, totalPrice) {
        const query = `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`;
        return connection.execute(query, [userId, totalPrice]);
    }

    static async addOrderItem(orderId, productId, quantity, price) {
        const query = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
        return connection.execute(query, [orderId, productId, quantity, price]);
    }

    static async getOrderById(orderId) {
        const query = `SELECT * FROM orders WHERE id = ?`;
        return connection.execute(query, [orderId]);
    }

    static async getOrderItems(orderId) {
        const query = `SELECT * FROM order_items WHERE order_id = ?`;
        return connection.execute(query, [orderId]);
    }

    static async updateOrderStatus(orderId, status) {
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        return connection.execute(query, [status, orderId]);
    }
}

module.exports = OrderModel;
