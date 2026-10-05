/**
 * MindProfileController - HTTP request handlers for Mind Profile API
 */

import MindProfileService from '../services/mindProfileService.js';

const mindProfileService = new MindProfileService();

/**
 * GET /api/mind-profile/scenarios
 * Get randomized scenarios for a quiz session
 */
export const getScenarios = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 7;
    
    if (count < 5 || count > 10) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_VALUE',
          message: 'Scenario count must be between 5 and 10'
        }
      });
    }
    
    const scenarios = await mindProfileService.getScenarios(count);
    
    res.json({
      success: true,
      data: { scenarios }
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch scenarios'
      }
    });
  }
};

/**
 * POST /api/mind-profile/submit-quiz
 * Submit quiz responses and get behavioral analysis
 */
export const submitQuiz = async (req, res) => {
  try {
    const { responses, scenarios } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Responses array is required'
        }
      });
    }
    
    if (!scenarios || !Array.isArray(scenarios)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Scenarios array is required'
        }
      });
    }
    
    if (responses.length !== scenarios.length) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Number of responses must match number of scenarios'
        }
      });
    }
    
    // Validate each response
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      
      if (!response.scenarioId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: `Response ${i + 1}: scenarioId is required`,
            field: `responses[${i}].scenarioId`
          }
        });
      }
      
      if (!response.selectedOption || response.selectedOption < 1 || response.selectedOption > 3) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_VALUE',
            message: `Response ${i + 1}: selectedOption must be 1, 2, or 3`,
            field: `responses[${i}].selectedOption`
          }
        });
      }
      
      if (typeof response.responseTime !== 'number' || response.responseTime <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: `Response ${i + 1}: responseTime must be a positive number`,
            field: `responses[${i}].responseTime`
          }
        });
      }
      
      if (response.changedAnswer !== undefined && typeof response.changedAnswer !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: `Response ${i + 1}: changedAnswer must be a boolean`,
            field: `responses[${i}].changedAnswer`
          }
        });
      }
    }
    
    // Process quiz
    const result = await mindProfileService.processQuiz(userId, responses, scenarios);
    
    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        personality: result.personality,
        personalityDescription: result.personalityDescription,
        personalityIcon: result.personalityIcon,
        scores: result.scores
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to process quiz'
      }
    });
  }
};

/**
 * POST /api/mind-profile/generate-insights
 * Generate AI-powered insights for a session
 */
export const generateInsights = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'sessionId is required'
        }
      });
    }
    
    const insights = await mindProfileService.generateInsights(sessionId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    
    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Invalid session ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate insights'
      }
    });
  }
};

/**
 * GET /api/mind-profile/history
 * Get user's quiz history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_VALUE',
          message: 'Limit must be between 1 and 50'
        }
      });
    }
    
    const history = await mindProfileService.getHistory(userId, limit);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch history'
      }
    });
  }
};
