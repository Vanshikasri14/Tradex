/**
 * PersonalityDetector - Rule-based personality classification
 * 
 * Determines trading personality type based on behavioral scores using
 * deterministic rules. NO AI is used in this classification.
 * 
 * Personality Types:
 * - Fearful Protector: High fear, low risk
 * - Revenge Trader: High revenge score
 * - Overconfident Gambler: High risk, low discipline
 * - Hesitant Analyst: High hesitation
 * - Disciplined Sniper: High discipline and confidence
 * - Balanced Trader: Default when no conditions match
 */

class PersonalityDetector {
  /**
   * Detect personality type based on behavioral scores
   * @param {Object} scores - Object containing all 6 behavioral scores
   * @returns {string} Personality type name
   */
  detectPersonality(scores) {
    const personalities = [
      {
        type: 'Fearful Protector',
        condition: scores.fear_score > 60 && scores.risk_score < 40,
        priority: scores.fear_score
      },
      {
        type: 'Revenge Trader',
        condition: scores.revenge_score > 60,
        priority: scores.revenge_score
      },
      {
        type: 'Overconfident Gambler',
        condition: scores.risk_score > 70 && scores.discipline_score < 40,
        priority: scores.risk_score
      },
      {
        type: 'Hesitant Analyst',
        condition: scores.hesitation_score > 60,
        priority: scores.hesitation_score
      },
      {
        type: 'Disciplined Sniper',
        condition: scores.discipline_score > 70 && scores.confidence_score > 60,
        priority: scores.discipline_score + scores.confidence_score
      }
    ];

    // Filter personalities that match their conditions
    const matches = personalities.filter(p => p.condition);
    
    // If no matches, return default
    if (matches.length === 0) {
      return 'Balanced Trader';
    }

    // Return personality with highest priority
    return matches.reduce((prev, current) => 
      current.priority > prev.priority ? current : prev
    ).type;
  }

  /**
   * Get description for a personality type
   * @param {string} personalityType - The personality type name
   * @returns {string} Description of the personality
   */
  getPersonalityDescription(personalityType) {
    const descriptions = {
      'Fearful Protector': 'You prioritize capital preservation over growth opportunities. While this protects you from major losses, it may limit your upside potential.',
      'Revenge Trader': 'You tend to chase losses with aggressive recovery attempts. This emotional response to losses can compound your problems and increase risk.',
      'Overconfident Gambler': 'You take excessive risks without proper risk management. Your confidence is admirable, but it needs to be balanced with discipline.',
      'Hesitant Analyst': 'You overthink decisions and struggle with execution. Analysis is important, but paralysis by analysis can cause you to miss opportunities.',
      'Disciplined Sniper': 'You execute with precision and maintain emotional control. You follow your plan and manage risk effectively.',
      'Balanced Trader': 'You demonstrate balanced decision-making across scenarios. You show a mix of traits without extreme tendencies in any direction.'
    };
    
    return descriptions[personalityType] || 'Your trading personality shows unique characteristics.';
  }

  /**
   * Get icon/emoji for a personality type
   * @param {string} personalityType - The personality type name
   * @returns {string} Icon representing the personality
   */
  getPersonalityIcon(personalityType) {
    const icons = {
      'Fearful Protector': '🛡️',
      'Revenge Trader': '⚔️',
      'Overconfident Gambler': '🎲',
      'Hesitant Analyst': '🤔',
      'Disciplined Sniper': '🎯',
      'Balanced Trader': '⚖️'
    };
    
    return icons[personalityType] || '📊';
  }
}

export default PersonalityDetector;
