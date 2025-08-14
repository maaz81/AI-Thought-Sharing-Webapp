const express = require('express');
const router = express.Router();
const {login} = require('../../controllers/admin/adminAuth');

router.post('/login',login);
module.exports = router;