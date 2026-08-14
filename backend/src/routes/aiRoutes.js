const express = require('express');
const { analyzeHealthData, chatAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeHealthData);
router.post('/chat', protect, chatAssistant);

module.exports = router;
