const express = require('express');
const router = express.Router();
const { generatePostSuggestions } = require('../controlllers/aiControllers');

router.post('/suggest', generatePostSuggestions);

module.exports = router;
