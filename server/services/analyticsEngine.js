/**
 * AnalyticsEngine - Pure rule-based behavioral score calculation
 * 
 * This service computes 6 behavioral scores from quiz responses:
 * - Risk Score: Percentage of aggressive choices
 * - Fear Score: Percentage of conservative choices in profit scenarios
 * - Revenge Score: Percentage of aggressive choices in loss scenarios
 * - Discipline Score: Percentage of correct (risk-management aligned) answers
 * - Hesitation Score: Based on slow responses (>8s) and changed answers
 * - Confidence Score: Based on fast responses (<3s) and consistent answers
 * 
 * All scores are integers from 0-100.
 * NO AI is used - this is pure rule-based logic.
 */

class AnalyticsEngine {
  /**
   * Compute all 6 behavioral scores from quiz responses
   * @param {Array} responses - Array of response objects with properties:
   *   - choice_type: 'aggressive' | 'conservative'
   *   - scenario_type: 'profit' | 'loss' | 'neutral'
   *   - is_correct: boolean
   *   - response_time: number (seconds)
   *   - changed_answer: boolean
   * @returns {Object} Object containing all 6 scores (integers 0-100)
   */
  computeScores(responses) {
    const riskScore = this.calculateRiskScore(responses);
    const fearScore = this.calculateFearScore(responses);
    const revengeScore = this.calculateRevengeScore(responses);
    const disciplineScore = this.calculateDisciplineScore(responses);
    const hesitationScore = this.calculateHesitationScore(responses);
    const confidenceScore = this.calculateConfidenceScore(responses);
    
    return {
      risk_score: riskScore,
      fear_score: fearScore,
      revenge_score: revengeScore,
      discipline_score: disciplineScore,
      hesitation_score: hesitationScore,
      confidence_score: confidenceScore
    };
  }

  /**
   * Calculate Risk Score: Percentage of aggressive choices
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateRiskScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const aggressiveChoices = responses.filter(r => r.choice_type === 'aggressive').length;
    return Math.round((aggressiveChoices / responses.length) * 100);
  }

  /**
   * Calculate Fear Score: Percentage of conservative choices in profit scenarios
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateFearScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const profitScenarios = responses.filter(r => r.scenario_type === 'profit');
    
    if (profitScenarios.length === 0) {
      return 0;
    }
    
    const conservativeInProfit = profitScenarios.filter(r => r.choice_type === 'conservative').length;
    return Math.round((conservativeInProfit / profitScenarios.length) * 100);
  }

  /**
   * Calculate Revenge Score: Percentage of aggressive choices in loss scenarios
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateRevengeScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const lossScenarios = responses.filter(r => r.scenario_type === 'loss');
    
    if (lossScenarios.length === 0) {
      return 0;
    }
    
    const aggressiveInLoss = lossScenarios.filter(r => r.choice_type === 'aggressive').length;
    return Math.round((aggressiveInLoss / lossScenarios.length) * 100);
  }

  /**
   * Calculate Discipline Score: Percentage of correct (risk-management aligned) answers
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateDisciplineScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const correctAnswers = responses.filter(r => r.is_correct).length;
    return Math.round((correctAnswers / responses.length) * 100);
  }

  /**
   * Calculate Hesitation Score: Based on slow responses (>8s) and changed answers
   * Higher score indicates more hesitation
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateHesitationScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const slowResponses = responses.filter(r => r.response_time > 8).length;
    const changedAnswers = responses.filter(r => r.changed_answer).length;
    const hesitationIndicators = slowResponses + changedAnswers;
    
    return Math.min(100, Math.round((hesitationIndicators / responses.length) * 100));
  }

  /**
   * Calculate Confidence Score: Based on fast responses (<3s) and consistent answers
   * Higher score indicates more confidence
   * @param {Array} responses - Quiz responses
   * @returns {number} Integer 0-100
   */
  calculateConfidenceScore(responses) {
    if (!responses || responses.length === 0) {
      return 0;
    }
    
    const fastResponses = responses.filter(r => r.response_time < 3).length;
    const consistentAnswers = responses.filter(r => !r.changed_answer).length;
    const confidenceIndicators = fastResponses + (consistentAnswers * 0.5);
    
    return Math.min(100, Math.round((confidenceIndicators / responses.length) * 50));
  }
}

export default AnalyticsEngine;
