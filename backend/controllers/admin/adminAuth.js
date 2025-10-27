const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      // sameSite: 'Strict', // or 'Lax', depending on your use case
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
      email,
      role: 'admin',
      message: 'Login successful'
    });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  res.json({ message: 'Logged out successfully' });
};



module.exports = { login , logout};
