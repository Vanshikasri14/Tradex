/**
 * MindProfileService - Business logic orchestration for Mind Profile feature
 * 
 * Coordinates between analytics engine, personality detector, AI insight generator,
 * and repository to provide complete quiz functionality.
 */

import AnalyticsEngine from './analyticsEngine.js';
import PersonalityDetector from './personalityDetector.js';
import AIInsightGenerator from './aiInsightGenerator.js';
import MindProfileRepository from '../repositories/mindProfileRepository.js';

class MindProfileService {
  constructor() {
    this.analyticsEngine = new AnalyticsEngine();
    this.personalityDetector = new PersonalityDetector();
    this.aiInsightGenerator = new AIInsightGenerator();
    this.repository = new MindProfileRepository();
  }

  /**
   * Get randomized scenarios for a quiz session
   * Ensures at least one scenario of each type (profit, loss, neutral)
   * @param {number} count - Number of scenarios (default 7)
   * @returns {Promise<Array>} Array of scenarios with simplified structure
   */
  async getScenarios(count = 7) {
    // Get more scenarios than needed to ensure type distribution
    const scenarios = await this.repository.getScenarios(count + 3);
    
    // Ensure we have at least one of each type
    const profitScenarios = scenarios.filter(s => s.scenario_type === 'profit');
    const lossScenarios = scenarios.filter(s => s.scenario_type === 'loss');
    const neutralScenarios = scenarios.filter(s => s.scenario_type === 'neutral');
    
    // Build final set with guaranteed distribution
    const finalScenarios = [];
    
    // Add at least one of each type
    if (profitScenarios.length > 0) finalScenarios.push(profitScenarios[0]);
    if (lossScenarios.length > 0) finalScenarios.push(lossScenarios[0]);
    if (neutralScenarios.length > 0) finalScenarios.push(neutralScenarios[0]);
    
    // Fill remaining slots with random scenarios
    const remaining = scenarios.filter(s => !finalScenarios.includes(s));
    while (finalScenarios.length < count && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      finalScenarios.push(remaining.splice(randomIndex, 1)[0]);
    }
    
    // Shuffle the final set
    for (let i = finalScenarios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalScenarios[i], finalScenarios[j]] = [finalScenarios[j], finalScenarios[i]];
    }
    
    // Return simplified structure for frontend
    return finalScenarios.slice(0, count).map(s => ({
      id: s.id,
      description: s.description,
      options: [s.option_1, s.option_2, s.option_3],
      // Keep metadata for backend processing
      _metadata: {
        correct_option: s.correct_option,
        option_types: [s.option_1_type, s.option_2_type, s.option_3_type],
        scenario_type: s.scenario_type
      }
    }));
  }

  /**
   * Process quiz responses and compute behavioral analysis
   * @param {string} userId - User ID
   * @param {Array} responses - Array of user responses
   * @param {Array} scenarios - Array of scenario objects with metadata
   * @returns {Promise<Object>} Object containing personality, scores, and sessionId
   */
  async processQuiz(userId, responses, scenarios) {
    // Validate responses
    if (!responses || responses.length === 0) {
      throw new Error('No responses provided');
    }
    
    if (responses.length !== scenarios.length) {
      throw new Error('Response count does not match scenario count');
    }
    
    // Enrich responses with scenario metadata for scoring
    const enrichedResponses = responses.map((response, index) => {
      const scenario = scenarios.find(s => s.id === response.scenarioId);
      
      if (!scenario) {
        throw new Error(`Scenario not found: ${response.scenarioId}`);
      }
      
      const metadata = scenario._metadata;
      const selectedOptionIndex = response.selectedOption - 1; // Convert to 0-based index
      
      return {
        scenario_id: response.scenarioId,
        selected_option: response.selectedOption,
        is_correct: response.selectedOption === metadata.correct_option,
        choice_type: metadata.option_types[selectedOptionIndex],
        scenario_type: metadata.scenario_type,
        response_time: response.responseTime,
        changed_answer: response.changedAnswer || false
      };
    });
    
    // Compute behavioral scores using analytics engine
    const scores = this.analyticsEngine.computeScores(enrichedResponses);
    
    // Detect personality type
    const personality = this.personalityDetector.detectPersonality(scores);
    
    // Create session in database
    const sessionId = await this.repository.createSession(userId, personality, scores);
    
    // Save responses
    await this.repository.saveResponses(sessionId, enrichedResponses);
    
    return {
      sessionId,
      personality,
      personalityDescription: this.personalityDetector.getPersonalityDescription(personality),
      personalityIcon: this.personalityDetector.getPersonalityIcon(personality),
      scores
    };
  }

  /**
   * Generate AI-powered insights for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Object containing AI insights
   */
  async generateInsights(sessionId) {
    // Get session data
    const session = await this.repository.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Get responses for summary
    const responses = await this.repository.getSessionResponses(sessionId);
    
    // Build response summary
    const responseSummary = this.buildResponseSummary(responses);
    
    // Generate insights using AI
    const scores = {
      risk_score: session.risk_score,
      fear_score: session.fear_score,
      revenge_score: session.revenge_score,
      discipline_score: session.discipline_score,
      hesitation_score: session.hesitation_score,
      confidence_score: session.confidence_score
    };
    
    const insights = await this.aiInsightGenerator.generate(
      session.personality_type,
      scores,
      responseSummary
    );
    
    // Update session with insights
    await this.repository.updateSessionWithInsights(sessionId, insights);
    
    return insights;
  }

  /**
   * Get user's quiz history
   * @param {string} userId - User ID
   * @param {number} limit - Number of sessions to retrieve
   * @returns {Promise<Object>} Object containing sessions array and total count
   */
  async getHistory(userId, limit = 10) {
    const sessions = await this.repository.getUserHistory(userId, limit);
    
    return {
      sessions: sessions.map(s => ({
        id: s.id,
        personality: s.personality_type,
        scores: {
          risk_score: s.risk_score,
          fear_score: s.fear_score,
          revenge_score: s.revenge_score,
          discipline_score: s.discipline_score,
          hesitation_score: s.hesitation_score,
          confidence_score: s.confidence_score
        },
        completedAt: s.completed_at
      })),
      total: sessions.length
    };
  }

  /**
   * Build a summary of user responses for AI context
   * @param {Array} responses - Array of response objects
   * @returns {string} Summary text
   */
  buildResponseSummary(responses) {
    const totalResponses = responses.length;
    const avgResponseTime = responses.reduce((sum, r) => sum + parseFloat(r.response_time), 0) / totalResponses;
    const changedCount = responses.filter(r => r.changed_answer).length;
    const correctCount = responses.filter(r => r.is_correct).length;
    
    return `Completed ${totalResponses} scenarios with ${correctCount} correct answers (${Math.round(correctCount/totalResponses*100)}%). Average response time: ${avgResponseTime.toFixed(1)}s. Changed answers ${changedCount} times.`;
  }
}

export default MindProfileService;
