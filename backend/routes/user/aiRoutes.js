const express = require('express');
const router = express.Router();
const {
  generatePostSuggestions,
  handleAIChat,
  handleAIReview,
} = require('../../controllers/user/aiControllers');

router.post('/suggest', generatePostSuggestions);
router.post('/chat', handleAIChat);
router.post('/review', handleAIReview);

module.exports = router;
