const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');

exports.register = (req, res) => {
  const { full_name, email, password, contact_no } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const newUser = { full_name, email, password: hashedPassword, contact_no };

    User.create(newUser, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};
