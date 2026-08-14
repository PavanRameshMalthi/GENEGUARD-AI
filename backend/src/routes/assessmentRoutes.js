const express = require('express');
const { createAssessment, getAssessments } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createAssessment).get(protect, getAssessments);

module.exports = router;
