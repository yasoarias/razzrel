const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (full_name, email, password, contact_no) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.full_name, userData.email, userData.password, userData.contact_no], callback);
  },
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  },
};

module.exports = User;
