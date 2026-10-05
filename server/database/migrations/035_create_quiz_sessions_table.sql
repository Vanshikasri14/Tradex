-- Create quiz_sessions table for Trader Mind Profile feature
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  personality_type VARCHAR(50) NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  fear_score INTEGER NOT NULL CHECK (fear_score BETWEEN 0 AND 100),
  revenge_score INTEGER NOT NULL CHECK (revenge_score BETWEEN 0 AND 100),
  discipline_score INTEGER NOT NULL CHECK (discipline_score BETWEEN 0 AND 100),
  hesitation_score INTEGER NOT NULL CHECK (hesitation_score BETWEEN 0 AND 100),
  confidence_score INTEGER NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  ai_insights TEXT,
  ai_strengths TEXT,
  ai_weaknesses TEXT,
  market_prediction TEXT,
  improvement_plan JSONB,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_completed ON quiz_sessions(user_id, completed_at DESC);

-- Create trigger to automatically update updated_at (if needed in future)
-- Note: No updated_at column in current schema, but following pattern from scenarios table
