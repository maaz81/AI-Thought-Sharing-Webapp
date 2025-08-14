const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const login =  (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      email,
      role: 'admin',
      token
    });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
}

module.exports ={login};
