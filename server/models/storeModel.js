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

  update: async (id, storeData) => {
    const { name, address, email, owner_id } = storeData;
    const [result] = await pool.query(
      'UPDATE stores SET name = ?, address = ?, email = ?, owner_id = ? WHERE id = ?',
      [name, address, email, owner_id, id]
    );
    return result.affectedRows > 0;
  },

  softDelete: async (id) => {
    const [result] = await pool.query('UPDATE stores SET is_deleted = TRUE WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  findAll: async (filters = {}) => {
    const { name, email, address, sortBy, order, userId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as owner_name, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as overall_rating
      ${userId ? ', (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating' : ''}
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE s.is_deleted = FALSE`;
    
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
      const allowedSort = ['name', 'email', 'address', 'overall_rating', 'created_at'];
      if (allowedSort.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
      }
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM stores WHERE is_deleted = FALSE';
    const countParams = params.slice(userId ? 1 : 0, -2);
    if (name) countQuery += ' AND name LIKE ?';
    if (email) countQuery += ' AND email LIKE ?';
    if (address) countQuery += ' AND address LIKE ?';

    const [countRows] = await pool.query(countQuery, countParams);

    return {
      stores: rows,
      total: countRows[0].total,
      page: Number(page),
      totalPages: Math.ceil(countRows[0].total / limit)
    };
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM stores WHERE id = ? AND is_deleted = FALSE', [id]);
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
    const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ? AND is_deleted = FALSE', [ownerId]);
    return rows[0];
  }
};

module.exports = Store;
