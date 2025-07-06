const jwt = require('jsonwebtoken');
const envSecrets = require('../config/env');

const generateToken = (userId) =>{
    return jwt.sign({ id: userId}, envSecrets.JWT_SECRET)
}

module.exports = {generateToken};

