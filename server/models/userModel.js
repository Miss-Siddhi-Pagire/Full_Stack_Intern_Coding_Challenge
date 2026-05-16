const pool = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND is_deleted = FALSE', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, address, role, status, created_at FROM users WHERE id = ? AND is_deleted = FALSE', [id]);
    return rows[0];
  },

  create: async (userData) => {
    const { name, email, password, address, role } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, address, role || 'User']
    );
    return result.insertId;
  },

  update: async (id, userData) => {
    const { name, email, address, role, status } = userData;
    let query = 'UPDATE users SET name = ?, email = ?, address = ?, role = ?, status = ? WHERE id = ?';
    const [result] = await pool.query(query, [name, email, address, role, status, id]);
    return result.affectedRows > 0;
  },

  updatePassword: async (id, hashedPassword) => {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  softDelete: async (id) => {
    const [result] = await pool.query('UPDATE users SET is_deleted = TRUE WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  findAll: async (filters = {}) => {
    const { name, email, address, role, status, sortBy, order, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, name, email, address, role, status, created_at FROM users WHERE is_deleted = FALSE';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (sortBy) {
      const allowedSort = ['name', 'email', 'address', 'role', 'status', 'created_at'];
      if (allowedSort.includes(sortBy)) {
        query += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE is_deleted = FALSE';
    const countParams = params.slice(0, -2); // Remove limit and offset
    // Re-apply filters to countQuery
    if (name) countQuery += ' AND name LIKE ?';
    if (email) countQuery += ' AND email LIKE ?';
    if (address) countQuery += ' AND address LIKE ?';
    if (role) countQuery += ' AND role = ?';
    if (status) countQuery += ' AND status = ?';
    
    const [countRows] = await pool.query(countQuery, countParams);
    
    return {
      users: rows,
      total: countRows[0].total,
      page: Number(page),
      totalPages: Math.ceil(countRows[0].total / limit)
    };
  }
};

module.exports = User;
