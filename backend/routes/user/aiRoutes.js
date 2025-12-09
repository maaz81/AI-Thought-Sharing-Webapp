const express = require('express');
const router = express.Router();
const { 
  generatePostSuggestions, 
  handleAIChat,
  handleAIReview,        // 👈 NEW IMPORT
} = require('../../controllers/user/aiControllers');

router.post('/suggest', generatePostSuggestions);
router.post('/chat', handleAIChat);
router.post('/review', handleAIReview);   // 👈 NEW ROUTE

module.exports = router;
