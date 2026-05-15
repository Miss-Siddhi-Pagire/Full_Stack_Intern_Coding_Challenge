const pool = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [id]);
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

  updatePassword: async (id, hashedPassword) => {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  },

  findAll: async (filters = {}) => {
    const { name, email, address, role, sortBy, order } = filters;
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
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

    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = User;
