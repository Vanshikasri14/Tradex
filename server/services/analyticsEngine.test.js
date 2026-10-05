import AnalyticsEngine from './analyticsEngine.js';

describe('AnalyticsEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AnalyticsEngine();
  });

  describe('computeScores', () => {
    it('should return all 6 scores as integers 0-100', () => {
      const responses = [
        {
          choice_type: 'aggressive',
          scenario_type: 'profit',
          is_correct: true,
          response_time: 2,
          changed_answer: false
        },
        {
          choice_type: 'conservative',
          scenario_type: 'loss',
          is_correct: true,
          response_time: 5,
          changed_answer: false
        },
        {
          choice_type: 'aggressive',
          scenario_type: 'loss',
          is_correct: false,
          response_time: 10,
          changed_answer: true
        }
      ];

      const scores = engine.computeScores(responses);

      expect(scores).toHaveProperty('risk_score');
      expect(scores).toHaveProperty('fear_score');
      expect(scores).toHaveProperty('revenge_score');
      expect(scores).toHaveProperty('discipline_score');
      expect(scores).toHaveProperty('hesitation_score');
      expect(scores).toHaveProperty('confidence_score');

      // All scores should be integers between 0-100
      Object.values(scores).forEach(score => {
        expect(Number.isInteger(score)).toBe(true);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('calculateRiskScore', () => {
    it('should return percentage of aggressive choices', () => {
      const responses = [
        { choice_type: 'aggressive' },
        { choice_type: 'conservative' },
        { choice_type: 'aggressive' },
        { choice_type: 'aggressive' }
      ];

      const score = engine.calculateRiskScore(responses);
      expect(score).toBe(75); // 3 out of 4 = 75%
    });

    it('should return 0 for empty responses', () => {
      expect(engine.calculateRiskScore([])).toBe(0);
    });
  });

  describe('calculateFearScore', () => {
    it('should return percentage of conservative choices in profit scenarios', () => {
      const responses = [
        { choice_type: 'conservative', scenario_type: 'profit' },
        { choice_type: 'aggressive', scenario_type: 'profit' },
        { choice_type: 'conservative', scenario_type: 'profit' },
        { choice_type: 'aggressive', scenario_type: 'loss' }
      ];

      const score = engine.calculateFearScore(responses);
      expect(score).toBe(67); // 2 out of 3 profit scenarios = 66.67% rounded to 67
    });

    it('should return 0 when no profit scenarios exist', () => {
      const responses = [
        { choice_type: 'conservative', scenario_type: 'loss' },
        { choice_type: 'aggressive', scenario_type: 'loss' }
      ];

      expect(engine.calculateFearScore(responses)).toBe(0);
    });
  });

  describe('calculateRevengeScore', () => {
    it('should return percentage of aggressive choices in loss scenarios', () => {
      const responses = [
        { choice_type: 'aggressive', scenario_type: 'loss' },
        { choice_type: 'conservative', scenario_type: 'loss' },
        { choice_type: 'aggressive', scenario_type: 'loss' },
        { choice_type: 'conservative', scenario_type: 'profit' }
      ];

      const score = engine.calculateRevengeScore(responses);
      expect(score).toBe(67); // 2 out of 3 loss scenarios = 66.67% rounded to 67
    });

    it('should return 0 when no loss scenarios exist', () => {
      const responses = [
        { choice_type: 'aggressive', scenario_type: 'profit' },
        { choice_type: 'conservative', scenario_type: 'profit' }
      ];

      expect(engine.calculateRevengeScore(responses)).toBe(0);
    });
  });

  describe('calculateDisciplineScore', () => {
    it('should return percentage of correct answers', () => {
      const responses = [
        { is_correct: true },
        { is_correct: false },
        { is_correct: true },
        { is_correct: true }
      ];

      const score = engine.calculateDisciplineScore(responses);
      expect(score).toBe(75); // 3 out of 4 = 75%
    });
  });

  describe('calculateHesitationScore', () => {
    it('should calculate based on slow responses and changed answers', () => {
      const responses = [
        { response_time: 10, changed_answer: false }, // slow
        { response_time: 5, changed_answer: true },   // changed
        { response_time: 9, changed_answer: true },   // both
        { response_time: 3, changed_answer: false }   // neither
      ];

      const score = engine.calculateHesitationScore(responses);
      // 2 slow (>8s) + 2 changed = 4 indicators / 4 responses = 100%
      expect(score).toBe(100);
    });

    it('should cap at 100', () => {
      const responses = [
        { response_time: 10, changed_answer: true },
        { response_time: 9, changed_answer: true }
      ];

      const score = engine.calculateHesitationScore(responses);
      expect(score).toBe(100); // Would be 200% but capped at 100
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should calculate based on fast responses and consistent answers', () => {
      const responses = [
        { response_time: 2, changed_answer: false },  // fast + consistent
        { response_time: 5, changed_answer: false },  // consistent only
        { response_time: 1, changed_answer: true },   // fast only
        { response_time: 7, changed_answer: true }    // neither
      ];

      const score = engine.calculateConfidenceScore(responses);
      // 2 fast + (3 consistent * 0.5) = 3.5 indicators / 4 responses * 50 = 43.75 rounded to 44
      expect(score).toBe(44);
    });

    it('should cap at 100', () => {
      const responses = [
        { response_time: 1, changed_answer: false },
        { response_time: 2, changed_answer: false }
      ];

      const score = engine.calculateConfidenceScore(responses);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
