/**
 * AIInsightGenerator - LLM-powered personalized insight generation
 * 
 * This service generates personalized trading psychology insights using an LLM.
 * It includes timeout handling and fallback mechanisms for reliability.
 * 
 * IMPORTANT: This is the ONLY component that uses AI in the Mind Profile feature.
 * All scoring and personality detection is rule-based.
 */

class AIInsightGenerator {
  constructor() {
    this.timeout = 10000; // 10 second timeout
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = 'llama-3.1-70b-versatile'; // Fast and high-quality
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  /**
   * Generate personalized insights for a trading profile
   * @param {string} personality - The detected personality type
   * @param {Object} scores - All 6 behavioral scores
   * @param {string} responseSummary - Brief summary of user's responses
   * @returns {Promise<Object>} Object containing insights, strengths, weaknesses, prediction, and improvement plan
   */
  async generate(personality, scores, responseSummary) {
    try {
      const prompt = this.buildPrompt(personality, scores, responseSummary);
      const response = await this.callLLM(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('AI insight generation failed:', error.message);
      return this.getFallbackInsights(personality, scores);
    }
  }

  /**
   * Build the prompt for the LLM
   * @param {string} personality - Personality type
   * @param {Object} scores - Behavioral scores
   * @param {string} responseSummary - Response summary
   * @returns {string} Formatted prompt
   */
  buildPrompt(personality, scores, responseSummary) {
    return `You are a trading psychology expert analyzing a trader's behavioral profile.

Personality Type: ${personality}

Behavioral Scores (0-100):
- Risk Score: ${scores.risk_score}
- Fear Score: ${scores.fear_score}
- Revenge Score: ${scores.revenge_score}
- Discipline Score: ${scores.discipline_score}
- Hesitation Score: ${scores.hesitation_score}
- Confidence Score: ${scores.confidence_score}

Response Summary:
${responseSummary}

Provide a concise, sharp analysis in the following format:

INSIGHTS:
[2-3 sentences explaining their trading psychology and decision patterns]

STRENGTHS:
[1-2 key strengths based on their profile]

WEAKNESSES:
[1-2 key weaknesses to address]

MARKET_PREDICTION:
[One specific prediction about how they'll behave in the next market downturn or rally]

IMPROVEMENT_PLAN:
- [Actionable step 1]
- [Actionable step 2]
- [Actionable step 3]

Keep it direct, insightful, and actionable. No fluff.`;
  }

  /**
   * Call the LLM API with timeout
   * @param {string} prompt - The prompt to send
   * @returns {Promise<string>} LLM response text
   */
  async callLLM(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Groq API timeout after 10 seconds');
      }
      throw error;
    }
  }

  /**
   * Parse the LLM response into structured data
   * @param {string} llmOutput - Raw LLM response
   * @returns {Object} Parsed insights object
   */
  parseResponse(llmOutput) {
    const sections = {
      aiInsights: this.extractSection(llmOutput, 'INSIGHTS'),
      strengths: this.extractSection(llmOutput, 'STRENGTHS'),
      weaknesses: this.extractSection(llmOutput, 'WEAKNESSES'),
      prediction: this.extractSection(llmOutput, 'MARKET_PREDICTION'),
      improvementPlan: this.extractBulletList(llmOutput, 'IMPROVEMENT_PLAN')
    };
    return sections;
  }

  /**
   * Extract a text section from LLM output
   * @param {string} text - Full LLM output
   * @param {string} sectionName - Section header to extract
   * @returns {string} Extracted section text
   */
  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:\\s*([^\\n]+(?:\\n(?!\\w+:)[^\\n]+)*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Extract bullet list from LLM output
   * @param {string} text - Full LLM output
   * @param {string} sectionName - Section header to extract
   * @returns {Array<string>} Array of bullet points
   */
  extractBulletList(text, sectionName) {
    const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`, 'i');
    const match = text.match(regex);
    if (!match) return [];
    
    return match[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  }

  /**
   * Get fallback insights when AI fails
   * @param {string} personality - Personality type
   * @param {Object} scores - Behavioral scores
   * @returns {Object} Generic insights object
   */
  getFallbackInsights(personality, scores) {
    const fallbacks = {
      'Fearful Protector': {
        aiInsights: 'As a Fearful Protector, you prioritize safety over growth. Your conservative approach shields you from major losses but may limit your profit potential. You tend to exit winning positions too early out of fear of giving back gains.',
        strengths: 'Strong risk management and capital preservation instincts',
        weaknesses: 'May miss significant opportunities due to excessive caution',
        prediction: 'In the next market rally, you\'ll likely take profits too early and watch from the sidelines as others capture larger gains.',
        improvementPlan: [
          'Set predetermined profit targets before entering trades',
          'Practice holding winners longer with trailing stops',
          'Review past trades where early exits cost you profits'
        ]
      },
      'Revenge Trader': {
        aiInsights: 'As a Revenge Trader, you respond emotionally to losses by increasing risk. This pattern of chasing losses with aggressive trades often compounds your problems. Your need to "get even" overrides rational decision-making.',
        strengths: 'High conviction and willingness to take action',
        weaknesses: 'Emotional decision-making after losses leads to increased risk',
        prediction: 'After your next losing streak, you\'ll likely double down on risky positions, potentially turning a small loss into a significant one.',
        improvementPlan: [
          'Implement a mandatory break after 2 consecutive losses',
          'Set daily loss limits and stop trading when hit',
          'Keep a journal to identify emotional triggers'
        ]
      },
      'Overconfident Gambler': {
        aiInsights: 'As an Overconfident Gambler, you take excessive risks without proper safeguards. Your confidence is admirable, but it\'s not backed by disciplined risk management. You believe you can beat the odds consistently.',
        strengths: 'High confidence and willingness to seize opportunities',
        weaknesses: 'Lack of risk management and overestimation of abilities',
        prediction: 'In volatile markets, you\'ll likely overtrade and take on excessive leverage, leading to significant drawdowns.',
        improvementPlan: [
          'Implement strict position sizing rules (max 2% risk per trade)',
          'Always use stop-losses before entering positions',
          'Track your win rate and average win/loss to reality-check confidence'
        ]
      },
      'Hesitant Analyst': {
        aiInsights: 'As a Hesitant Analyst, you overthink decisions and struggle with execution. Your analysis is thorough, but paralysis by analysis causes you to miss opportunities. You second-guess yourself frequently.',
        strengths: 'Thorough analysis and careful consideration of risks',
        weaknesses: 'Overthinking leads to missed opportunities and poor timing',
        prediction: 'You\'ll likely identify great opportunities but hesitate to act, watching them play out without you while you continue analyzing.',
        improvementPlan: [
          'Set time limits for decision-making (e.g., 5 minutes max)',
          'Create a simple checklist and execute when criteria are met',
          'Practice taking smaller positions to build execution confidence'
        ]
      },
      'Disciplined Sniper': {
        aiInsights: 'As a Disciplined Sniper, you execute with precision and maintain emotional control. You follow your plan, manage risk effectively, and make decisions based on logic rather than emotion. Your approach is sustainable long-term.',
        strengths: 'Excellent discipline, risk management, and emotional control',
        weaknesses: 'May occasionally be too rigid and miss adaptive opportunities',
        prediction: 'In both bull and bear markets, you\'ll likely maintain composure and stick to your strategy, achieving consistent results.',
        improvementPlan: [
          'Continue refining your edge through backtesting',
          'Document your process to maintain consistency',
          'Consider mentoring others to reinforce your disciplined approach'
        ]
      },
      'Balanced Trader': {
        aiInsights: 'As a Balanced Trader, you demonstrate moderate traits across all dimensions. You don\'t show extreme tendencies, which can be both a strength and a limitation. Your approach is adaptable but may lack a defined edge.',
        strengths: 'Adaptability and lack of extreme emotional biases',
        weaknesses: 'May lack a clear trading identity or specialized edge',
        prediction: 'Your results will likely be moderate - avoiding major disasters but also missing exceptional opportunities.',
        improvementPlan: [
          'Identify which market conditions suit you best',
          'Develop a specialized strategy rather than being a generalist',
          'Track performance to discover your natural strengths'
        ]
      }
    };

    return fallbacks[personality] || {
      aiInsights: `As a ${personality}, you demonstrate specific behavioral patterns in trading scenarios. Your scores suggest areas for both strength and improvement.`,
      strengths: 'Consistent decision-making approach',
      weaknesses: 'Potential for emotional bias in high-pressure situations',
      prediction: 'In volatile markets, you may need to consciously manage your natural tendencies.',
      improvementPlan: [
        'Practice scenario-based decision making',
        'Keep a trading journal to track emotional patterns',
        'Set predefined rules for high-stress situations'
      ]
    };
  }
}

export default AIInsightGenerator;
