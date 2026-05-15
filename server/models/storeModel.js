const pool = require('../config/db');

const Store = {
  create: async (storeData) => {
    const { name, address, email, owner_id } = storeData;
    const [result] = await pool.query(
      'INSERT INTO stores (name, address, email, owner_id) VALUES (?, ?, ?, ?)',
      [name, address, email, owner_id]
    );
    return result.insertId;
  },

  findAll: async (filters = {}) => {
    const { name, email, address, sortBy, order, userId } = filters;
    let query = `
      SELECT s.*, u.name as owner_name, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as overall_rating
      ${userId ? ', (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating' : ''}
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE 1=1`;
    const params = [];
    if (userId) params.push(userId);

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
    return rows[0];
  },

  getStats: async (storeId) => {
    const [rows] = await pool.query(
      'SELECT AVG(rating) as averageRating, COUNT(*) as totalRatings FROM ratings WHERE store_id = ?',
      [storeId]
    );
    return rows[0];
  },

  getRatings: async (storeId) => {
    const [rows] = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ? 
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  },

  findByOwnerId: async (ownerId) => {
    const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
    return rows[0];
  }
};

module.exports = Store;
