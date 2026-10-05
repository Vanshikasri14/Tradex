/**
 * Mind Profile API Client
 * Handles all API calls for the Mind Profile feature
 */

import api from './api.js';

const mindProfileAPI = {
  /**
   * Get randomized scenarios for a quiz session
   * @param {number} count - Number of scenarios (default 7)
   * @returns {Promise<Array>} Array of scenario objects
   */
  async getScenarios(count = 7) {
    const response = await api.get(`/mind-profile/scenarios?count=${count}`);
    return response.data.scenarios;
  },

  /**
   * Submit quiz responses and get behavioral analysis
   * @param {Array} responses - Array of user responses
   * @param {Array} scenarios - Array of scenario objects with metadata
   * @returns {Promise<Object>} Object containing sessionId, personality, and scores
   */
  async submitQuiz(responses, scenarios) {
    const response = await api.post('/mind-profile/submit-quiz', {
      responses,
      scenarios
    });
    return response.data;
  },

  /**
   * Generate AI-powered insights for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Object containing AI insights
   */
  async generateInsights(sessionId) {
    const response = await api.post('/mind-profile/generate-insights', {
      sessionId
    });
    return response.data;
  },

  /**
   * Get user's quiz history
   * @param {number} limit - Number of sessions to retrieve (default 10)
   * @returns {Promise<Object>} Object containing sessions array and total count
   */
  async getHistory(limit = 10) {
    const response = await api.get(`/mind-profile/history?limit=${limit}`);
    return response.data;
  }
};

export default mindProfileAPI;
