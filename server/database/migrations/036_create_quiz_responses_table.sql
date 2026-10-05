-- Create quiz_responses table for Trader Mind Profile feature
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  scenario_id UUID NOT NULL REFERENCES scenarios(id),
  selected_option INTEGER NOT NULL CHECK (selected_option BETWEEN 1 AND 3),
  is_correct BOOLEAN NOT NULL,
  choice_type VARCHAR(20) NOT NULL CHECK (choice_type IN ('aggressive', 'conservative', 'balanced')),
  scenario_type VARCHAR(20) NOT NULL CHECK (scenario_type IN ('profit', 'loss', 'neutral')),
  response_time DECIMAL(5, 2) NOT NULL CHECK (response_time > 0),
  changed_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session_id ON quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_scenario_id ON quiz_responses(scenario_id);
