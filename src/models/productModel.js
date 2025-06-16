const { pool } = require('../config/db');

class Product {
    static async create(name, description, price, imageUrl = null) {
        const [result] = await pool.execute(
            'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
            [name, description, price, imageUrl]
        );
        return { id: result.insertId, name, description, price, imageUrl };
    }

    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM products');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, description, price, imageUrl) {
        const [result] = await pool.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
            [name, description, price, imageUrl, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async updateImageUrl(id, imageUrl) {
        const [result] = await pool.execute(
            'UPDATE products SET image_url = ? WHERE id = ?',
            [imageUrl, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Product;