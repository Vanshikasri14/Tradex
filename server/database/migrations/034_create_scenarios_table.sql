-- Create scenarios table for Trader Mind Profile feature
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  correct_option INTEGER NOT NULL CHECK (correct_option BETWEEN 1 AND 3),
  option_1_type VARCHAR(20) NOT NULL CHECK (option_1_type IN ('aggressive', 'conservative', 'balanced')),
  option_2_type VARCHAR(20) NOT NULL CHECK (option_2_type IN ('aggressive', 'conservative', 'balanced')),
  option_3_type VARCHAR(20) NOT NULL CHECK (option_3_type IN ('aggressive', 'conservative', 'balanced')),
  scenario_type VARCHAR(20) NOT NULL CHECK (scenario_type IN ('profit', 'loss', 'neutral')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for scenario type filtering
CREATE INDEX IF NOT EXISTS idx_scenarios_type ON scenarios(scenario_type);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_scenarios_updated_at ON scenarios;
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample scenarios
INSERT INTO scenarios (description, option_1, option_2, option_3, correct_option, option_1_type, option_2_type, option_3_type, scenario_type) VALUES
('Your position is up 25% in 2 days. What do you do?',
 'Take full profit immediately',
 'Hold for more gains',
 'Take 50% profit, let rest run with stop-loss',
 3, 'conservative', 'aggressive', 'balanced', 'profit'),
 
('You just lost 15% on a trade. Your next move?',
 'Double position size to recover faster',
 'Take a break and analyze what went wrong',
 'Immediately enter opposite position',
 2, 'aggressive', 'balanced', 'aggressive', 'loss'),
 
('Market drops 5% while you''re in profit. You:',
 'Exit immediately to protect gains',
 'Hold based on original plan',
 'Add to position at lower price',
 2, 'conservative', 'balanced', 'aggressive', 'neutral'),

('Your stop-loss is hit on a trade. You:',
 'Re-enter immediately at a better price',
 'Accept the loss and move on',
 'Remove stop-loss and hold longer',
 2, 'aggressive', 'balanced', 'aggressive', 'loss'),

('A stock you''re watching drops 10% on no news. You:',
 'Buy immediately - it''s a discount',
 'Wait for confirmation of reversal',
 'Avoid it - something might be wrong',
 2, 'aggressive', 'balanced', 'conservative', 'neutral'),

('You''re up 50% on a position. The analyst upgrades it. You:',
 'Sell and take profits',
 'Hold for more upside',
 'Trim position and raise stop-loss',
 3, 'conservative', 'aggressive', 'balanced', 'profit'),

('Your portfolio is down 20% this month. You:',
 'Go all-in to recover losses quickly',
 'Reduce position sizes and reassess strategy',
 'Stop trading until market improves',
 2, 'aggressive', 'balanced', 'conservative', 'loss'),

('A trade goes against you by 5% in minutes. You:',
 'Cut the loss immediately',
 'Wait for your stop-loss to trigger',
 'Add to position to average down',
 2, 'conservative', 'balanced', 'aggressive', 'loss'),

('You miss a 30% gain on a stock you researched. You:',
 'Chase it at current price',
 'Wait for a pullback',
 'Move on to next opportunity',
 3, 'aggressive', 'balanced', 'balanced', 'neutral'),

('News breaks that could impact your position. You:',
 'Exit immediately before reading details',
 'Read the news and decide based on facts',
 'Hold and ignore short-term noise',
 2, 'conservative', 'balanced', 'aggressive', 'neutral');
