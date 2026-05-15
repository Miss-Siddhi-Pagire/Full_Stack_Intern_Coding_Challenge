const pool = require('../config/db');

const Rating = {
  submit: async (ratingData) => {
    const { user_id, store_id, rating } = ratingData;
    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
      [user_id, store_id, rating, rating]
    );
    return result.affectedRows;
  },

  update: async (user_id, store_id, rating) => {
    const [result] = await pool.query(
      'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
      [rating, user_id, store_id]
    );
    return result.affectedRows > 0;
  },

  delete: async (user_id, store_id) => {
    const [result] = await pool.query(
      'DELETE FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Rating;
