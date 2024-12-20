const connection = require('../Database/DB_connection.js');

class Review {
    // Get all reviews for a product
    static async getAllReviews(productId) {
        try {
            const [rows] = await connection.execute('SELECT * FROM review WHERE product_id = ?', [productId]);
            return rows;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error; // Re-throw the error for the caller to handle if needed
        }
    }

    // Create a new review
    static async createReview(rating, name, reviewImages, productId) {
        try {
            const [result] = await connection.execute(
                'INSERT INTO review (rating, name, review_images, product_id) VALUES (?, ?, ?, ?)',
                [rating, name, JSON.stringify(reviewImages), productId]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    // Update an existing review
    static async updateReview(id, rating, name, reviewImages) {
        try {
            await connection.execute(
                'UPDATE review SET rating = ?, name = ?, review_images = ? WHERE id = ?',
                [rating, name, JSON.stringify(reviewImages), id]
            );
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }

    // Delete a review
    static async deleteReview(id) {
        try {
            await connection.execute('DELETE FROM review WHERE id = ?', [id]);
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}

module.exports = Review;
