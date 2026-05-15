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
  }
};

module.exports = User;
