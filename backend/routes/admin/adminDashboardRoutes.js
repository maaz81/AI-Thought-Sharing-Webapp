const express = require('express');
const { verifyToken, isAdmin } = require('../../middleware/authAdminMiddleware');
const { dashboard } = require('../../controllers/admin/adminDashboard')
const router = express.Router();

router.get('/', verifyToken, isAdmin, dashboard);

module.exports = router;