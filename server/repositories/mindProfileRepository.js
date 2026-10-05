/**
 * MindProfileRepository - Database operations for Mind Profile feature
 * 
 * Handles all database interactions for scenarios, quiz sessions, and responses.
 */

import { query } from '../config/database.js';

class MindProfileRepository {
  /**
   * Get random scenarios for a quiz session
   * @param {number} limit - Number of scenarios to retrieve (default 7)
   * @returns {Promise<Array>} Array of scenario objects
   */
  async getScenarios(limit = 7) {
    const sql = `
      SELECT 
        id,
        description,
        option_1,
        option_2,
        option_3,
        correct_option,
        option_1_type,
        option_2_type,
        option_3_type,
        scenario_type
      FROM scenarios
      ORDER BY RANDOM()
      LIMIT $1
    `;
    
    const result = await query(sql, [limit]);
    return result.rows;
  }

  /**
   * Create a new quiz session
   * @param {string} userId - User ID
   * @param {string} personality - Detected personality type
   * @param {Object} scores - All 6 behavioral scores
   * @returns {Promise<string>} Session ID
   */
  async createSession(userId, personality, scores) {
    const sql = `
      INSERT INTO quiz_sessions (
        user_id,
        personality_type,
        risk_score,
        fear_score,
        revenge_score,
        discipline_score,
        hesitation_score,
        confidence_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const values = [
      userId,
      personality,
      scores.risk_score,
      scores.fear_score,
      scores.revenge_score,
      scores.discipline_score,
      scores.hesitation_score,
      scores.confidence_score
    ];
    
    const result = await query(sql, values);
    return result.rows[0].id;
  }

  /**
   * Save quiz responses for a session
   * @param {string} sessionId - Session ID
   * @param {Array} responses - Array of response objects
   * @returns {Promise<void>}
   */
  async saveResponses(sessionId, responses) {
    const sql = `
      INSERT INTO quiz_responses (
        session_id,
        scenario_id,
        selected_option,
        is_correct,
        choice_type,
        scenario_type,
        response_time,
        changed_answer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    
    // Insert all responses
    for (const response of responses) {
      const values = [
        sessionId,
        response.scenario_id,
        response.selected_option,
        response.is_correct,
        response.choice_type,
        response.scenario_type,
        response.response_time,
        response.changed_answer
      ];
      
      await query(sql, values);
    }
  }

  /**
   * Update session with AI-generated insights
   * @param {string} sessionId - Session ID
   * @param {Object} insights - AI-generated insights object
   * @returns {Promise<void>}
   */
  async updateSessionWithInsights(sessionId, insights) {
    const sql = `
      UPDATE quiz_sessions
      SET 
        ai_insights = $1,
        ai_strengths = $2,
        ai_weaknesses = $3,
        market_prediction = $4,
        improvement_plan = $5
      WHERE id = $6
    `;
    
    const values = [
      insights.aiInsights,
      insights.strengths,
      insights.weaknesses,
      insights.prediction,
      JSON.stringify(insights.improvementPlan),
      sessionId
    ];
    
    await query(sql, values);
  }

  /**
   * Get a quiz session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Session object or null if not found
   */
  async getSession(sessionId) {
    const sql = `
      SELECT 
        id,
        user_id,
        personality_type,
        risk_score,
        fear_score,
        revenge_score,
        discipline_score,
        hesitation_score,
        confidence_score,
        ai_insights,
        ai_strengths,
        ai_weaknesses,
        market_prediction,
        improvement_plan,
        completed_at,
        created_at
      FROM quiz_sessions
      WHERE id = $1
    `;
    
    const result = await query(sql, [sessionId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const session = result.rows[0];
    
    // Parse improvement_plan from JSONB
    if (session.improvement_plan) {
      session.improvement_plan = session.improvement_plan;
    }
    
    return session;
  }

  /**
   * Get user's quiz history
   * @param {string} userId - User ID
   * @param {number} limit - Number of sessions to retrieve (default 10)
   * @returns {Promise<Array>} Array of session objects
   */
  async getUserHistory(userId, limit = 10) {
    const sql = `
      SELECT 
        id,
        personality_type,
        risk_score,
        fear_score,
        revenge_score,
        discipline_score,
        hesitation_score,
        confidence_score,
        completed_at
      FROM quiz_sessions
      WHERE user_id = $1
      ORDER BY completed_at DESC
      LIMIT $2
    `;
    
    const result = await query(sql, [userId, limit]);
    return result.rows;
  }

  /**
   * Get responses for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array>} Array of response objects
   */
  async getSessionResponses(sessionId) {
    const sql = `
      SELECT 
        id,
        scenario_id,
        selected_option,
        is_correct,
        choice_type,
        scenario_type,
        response_time,
        changed_answer,
        created_at
      FROM quiz_responses
      WHERE session_id = $1
      ORDER BY created_at ASC
    `;
    
    const result = await query(sql, [sessionId]);
    return result.rows;
  }
}

export default MindProfileRepository;
