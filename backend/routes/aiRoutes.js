const express = require('express');
const router = express.Router();
const { generatePostSuggestions, handleAIChat } = require('../controllers/aiControllers');

router.post('/suggest', generatePostSuggestions);
router.post('/chat', handleAIChat);

module.exports = router;
