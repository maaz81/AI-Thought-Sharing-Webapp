const jwt = require('jsonwebtoken');
const envSecret = require('../config/env');

const protectRoutes = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: "Unautherized"});

    try {
        const decoded = jwt.verify(token, envSecret.JWT_SECRET);
        req.userId = decoded.id;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}
module.exports = protectRoutes;