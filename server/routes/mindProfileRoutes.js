/**
 * Mind Profile Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getScenarios,
  submitQuiz,
  generateInsights,
  getHistory
} from '../controllers/mindProfileController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/mind-profile/scenarios - Get randomized scenarios
router.get('/scenarios', getScenarios);

// POST /api/mind-profile/submit-quiz - Submit quiz and get analysis
router.post('/submit-quiz', submitQuiz);

// POST /api/mind-profile/generate-insights - Generate AI insights
router.post('/generate-insights', generateInsights);

// GET /api/mind-profile/history - Get user's quiz history
router.get('/history', getHistory);

export default router;
