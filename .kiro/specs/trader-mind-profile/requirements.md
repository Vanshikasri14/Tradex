# Requirements Document

## Introduction

The Trader Mind Profile is an AI-powered behavioral trading analyzer that evaluates traders' psychological profiles through interactive trading scenarios. The system combines rule-based behavioral analysis with AI-generated insights to provide personalized feedback on trading psychology, helping traders understand their decision-making patterns, emotional biases, and areas for improvement.

## Glossary

- **System**: The Trader Mind Profile feature module
- **Scenario_Engine**: The component that presents trading scenarios to users
- **Analytics_Engine**: The rule-based component that computes behavioral scores
- **Personality_Detector**: The rule-based component that determines personality type
- **AI_Insight_Generator**: The LLM-powered component that generates personalized insights
- **Result_Dashboard**: The UI component that displays analysis results
- **User_Response**: A user's answer to a scenario including selected option, timing, and changes
- **Behavioral_Score**: A calculated metric representing a psychological trait (0-100)
- **Personality_Type**: A classification of trading behavior pattern
- **Trading_Scenario**: An interactive situation requiring a trading decision
- **LLM_API**: Large Language Model API service for generating insights

## Requirements

### Requirement 1: Entry Screen

**User Story:** As a trader, I want to see an engaging entry screen, so that I understand what the test offers and can start quickly.

#### Acceptance Criteria

1. THE System SHALL display a title "Test Your Trading Mindset in 2 Minutes"
2. THE System SHALL display a start button to begin the simulation
3. THE System SHALL display a brief description of what the test evaluates
4. WHEN the user clicks the start button, THE System SHALL navigate to the first scenario

### Requirement 2: Scenario Presentation

**User Story:** As a trader, I want to experience realistic trading scenarios, so that my responses reflect my actual trading behavior.

#### Acceptance Criteria

1. THE Scenario_Engine SHALL present 5 to 7 scenarios sequentially
2. THE Scenario_Engine SHALL display each scenario with a market situation description
3. THE Scenario_Engine SHALL provide exactly 3 decision-based options for each scenario
4. THE Scenario_Engine SHALL allow the user to select only one option per scenario
5. WHEN a user selects an option, THE Scenario_Engine SHALL advance to the next scenario within 500 milliseconds
6. THE Scenario_Engine SHALL display a progress indicator showing current scenario number and total scenarios

### Requirement 3: Response Data Capture

**User Story:** As a system, I want to capture detailed response data, so that behavioral analysis can be accurate and comprehensive.

#### Acceptance Criteria

1. WHEN a user selects an option, THE System SHALL record the selected option identifier
2. WHEN a user selects an option, THE System SHALL record whether the option is correct based on risk management principles
3. WHEN a user selects an option, THE System SHALL record the response time in seconds from scenario display to selection
4. WHEN a user changes their selection before advancing, THE System SHALL record that the answer was changed
5. THE System SHALL record the scenario type as profit, loss, or neutral for each scenario
6. THE System SHALL store all User_Response data for the session

### Requirement 4: Rule-Based Score Calculation

**User Story:** As a system, I want to compute behavioral scores using deterministic rules, so that analysis is consistent and explainable.

#### Acceptance Criteria

1. THE Analytics_Engine SHALL compute risk_score as the percentage of aggressive choices selected
2. THE Analytics_Engine SHALL compute fear_score as the percentage of conservative choices in profit scenarios
3. THE Analytics_Engine SHALL compute revenge_score as the percentage of aggressive choices in loss scenarios
4. THE Analytics_Engine SHALL compute discipline_score as the percentage of correct answers in risk-management questions
5. THE Analytics_Engine SHALL compute hesitation_score based on responses slower than 8 seconds plus changed answers
6. THE Analytics_Engine SHALL compute confidence_score based on responses faster than 3 seconds plus consistent answers
7. THE Analytics_Engine SHALL express all Behavioral_Score values as integers between 0 and 100
8. THE Analytics_Engine SHALL complete all score calculations before invoking the AI_Insight_Generator

### Requirement 5: Personality Type Detection

**User Story:** As a trader, I want to know my trading personality type, so that I can understand my behavioral patterns.

#### Acceptance Criteria

1. WHEN fear_score exceeds 60 AND risk_score is below 40, THE Personality_Detector SHALL classify the user as "Fearful Protector"
2. WHEN revenge_score exceeds 60, THE Personality_Detector SHALL classify the user as "Revenge Trader"
3. WHEN risk_score exceeds 70 AND discipline_score is below 40, THE Personality_Detector SHALL classify the user as "Overconfident Gambler"
4. WHEN hesitation_score exceeds 60, THE Personality_Detector SHALL classify the user as "Hesitant Analyst"
5. WHEN discipline_score exceeds 70 AND confidence_score exceeds 60, THE Personality_Detector SHALL classify the user as "Disciplined Sniper"
6. WHEN multiple personality conditions match, THE Personality_Detector SHALL select the personality with the highest priority score
7. THE Personality_Detector SHALL assign a default personality type when no conditions match

### Requirement 6: AI Insight Generation

**User Story:** As a trader, I want personalized AI-generated insights, so that I receive actionable feedback specific to my behavior.

#### Acceptance Criteria

1. WHEN all behavioral scores are computed, THE AI_Insight_Generator SHALL invoke the LLM_API
2. THE AI_Insight_Generator SHALL provide the personality type, all behavioral scores, and user response summary to the LLM_API
3. THE AI_Insight_Generator SHALL request the LLM_API to generate a personalized explanation of behavior
4. THE AI_Insight_Generator SHALL request the LLM_API to identify strengths based on the behavioral profile
5. THE AI_Insight_Generator SHALL request the LLM_API to identify weaknesses based on the behavioral profile
6. THE AI_Insight_Generator SHALL request the LLM_API to generate a real-market prediction
7. THE AI_Insight_Generator SHALL request the LLM_API to generate an actionable improvement plan as bullet points
8. THE AI_Insight_Generator SHALL instruct the LLM_API to use a concise, sharp, and insightful tone
9. WHEN the LLM_API fails to respond within 10 seconds, THE AI_Insight_Generator SHALL return a timeout error
10. WHEN the LLM_API returns an error, THE AI_Insight_Generator SHALL provide fallback generic insights

### Requirement 7: Result Dashboard Display

**User Story:** As a trader, I want to see my results in a clear dashboard, so that I can quickly understand my trading psychology profile.

#### Acceptance Criteria

1. THE Result_Dashboard SHALL display a personality card showing the Personality_Type
2. THE Result_Dashboard SHALL display skill bars for risk_score, discipline_score, and confidence_score
3. THE Result_Dashboard SHALL display the AI-generated insights as a text block
4. THE Result_Dashboard SHALL highlight the real-market prediction in a visually distinct section
5. THE Result_Dashboard SHALL display the improvement plan as a bullet list
6. THE Result_Dashboard SHALL display all scores as percentages with visual indicators
7. THE Result_Dashboard SHALL be responsive and functional on mobile devices with screen widths down to 320 pixels

### Requirement 8: Backend API - Submit Quiz

**User Story:** As a frontend application, I want to submit quiz responses to the backend, so that scores can be computed and stored.

#### Acceptance Criteria

1. THE System SHALL provide a POST endpoint at /api/mind-profile/submit-quiz
2. WHEN the endpoint receives user responses, THE System SHALL validate that all required fields are present
3. WHEN validation passes, THE Analytics_Engine SHALL compute all behavioral scores
4. WHEN validation passes, THE Personality_Detector SHALL determine the personality type
5. THE System SHALL store the user responses, scores, and personality type in the database
6. THE System SHALL return a JSON response containing personality, scores, and a session identifier
7. WHEN validation fails, THE System SHALL return an error response with status code 400

### Requirement 9: Backend API - Generate AI Insights

**User Story:** As a frontend application, I want to request AI-generated insights, so that users receive personalized feedback.

#### Acceptance Criteria

1. THE System SHALL provide a POST endpoint at /api/mind-profile/generate-insights
2. WHEN the endpoint receives a session identifier, THE System SHALL retrieve the stored scores and personality
3. WHEN data is retrieved, THE AI_Insight_Generator SHALL invoke the LLM_API with the behavioral profile
4. THE System SHALL return a JSON response containing ai_insights, prediction, and improvement_plan
5. WHEN the session identifier is invalid, THE System SHALL return an error response with status code 404
6. WHEN the LLM_API fails, THE System SHALL return fallback insights with status code 200

### Requirement 10: Data Persistence

**User Story:** As a system, I want to persist user profiles and responses, so that users can track progress over time.

#### Acceptance Criteria

1. THE System SHALL store each completed quiz session with a unique identifier
2. THE System SHALL associate each quiz session with the authenticated user
3. THE System SHALL store the timestamp when the quiz was completed
4. THE System SHALL store all User_Response data for each scenario
5. THE System SHALL store all computed Behavioral_Score values
6. THE System SHALL store the determined Personality_Type
7. THE System SHALL store the AI-generated insights, prediction, and improvement plan

### Requirement 11: Frontend Routing and Navigation

**User Story:** As a trader, I want to access the mind profile feature from the main application, so that I can take the test when desired.

#### Acceptance Criteria

1. THE System SHALL provide a route at /mind-profile
2. THE System SHALL integrate the route into the existing React Router configuration
3. WHEN a user navigates to /mind-profile, THE System SHALL display the entry screen
4. THE System SHALL require authentication to access the /mind-profile route
5. WHEN an unauthenticated user attempts to access /mind-profile, THE System SHALL redirect to the sign-in page

### Requirement 12: Scenario Content Management

**User Story:** As a system, I want to manage scenario content, so that scenarios can be updated without code changes.

#### Acceptance Criteria

1. THE System SHALL store scenario definitions including description, options, correct answer, and scenario type
2. THE Scenario_Engine SHALL retrieve scenarios from the stored definitions
3. THE Scenario_Engine SHALL randomize the order of scenarios for each session
4. THE Scenario_Engine SHALL ensure each scenario type (profit, loss, neutral) is represented at least once per session
5. THE System SHALL support adding new scenarios without modifying the Analytics_Engine logic

### Requirement 13: Response Validation

**User Story:** As a system, I want to validate user responses, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN receiving quiz submission, THE System SHALL validate that the number of responses matches the number of scenarios presented
2. WHEN receiving quiz submission, THE System SHALL validate that each response contains required fields: selected_option, response_time, changed_answer, scenario_type
3. WHEN receiving quiz submission, THE System SHALL validate that response_time is a positive number
4. WHEN receiving quiz submission, THE System SHALL validate that changed_answer is a boolean value
5. WHEN validation fails, THE System SHALL return a descriptive error message indicating which validation rule failed

### Requirement 14: Performance Requirements

**User Story:** As a trader, I want the test to complete quickly, so that I can get results within the promised 2-3 minutes.

#### Acceptance Criteria

1. THE Scenario_Engine SHALL render each scenario within 200 milliseconds of the previous scenario completion
2. THE Analytics_Engine SHALL compute all behavioral scores within 500 milliseconds
3. THE System SHALL submit quiz responses to the backend within 1 second of the last scenario completion
4. THE Result_Dashboard SHALL display rule-based results within 2 seconds of quiz submission
5. THE AI_Insight_Generator SHALL complete LLM_API invocation within 10 seconds or timeout

### Requirement 15: Output Format Standardization

**User Story:** As a frontend application, I want a consistent API response format, so that result parsing is reliable.

#### Acceptance Criteria

1. THE System SHALL return quiz submission responses in JSON format with fields: personality, scores, session_id
2. THE System SHALL return insight generation responses in JSON format with fields: ai_insights, prediction, improvement_plan
3. THE scores field SHALL contain an object with keys: risk_score, fear_score, revenge_score, discipline_score, hesitation_score, confidence_score
4. THE improvement_plan field SHALL contain an array of strings
5. THE System SHALL include a success boolean field in all API responses
6. WHEN an error occurs, THE System SHALL include an error field with a descriptive message

### Requirement 16: Optional Enhancement - Retake Functionality

**User Story:** As a trader, I want to retake the test, so that I can see if my trading psychology has improved.

#### Acceptance Criteria

1. WHERE retake functionality is enabled, THE Result_Dashboard SHALL display a "Retake Test" button
2. WHERE retake functionality is enabled, WHEN the user clicks "Retake Test", THE System SHALL navigate to the entry screen
3. WHERE retake functionality is enabled, THE System SHALL generate a new session for the retake
4. WHERE retake functionality is enabled, THE System SHALL preserve previous test results for comparison

### Requirement 17: Optional Enhancement - Progress Tracking

**User Story:** As a trader, I want to track my progress over time, so that I can see how my trading psychology evolves.

#### Acceptance Criteria

1. WHERE progress tracking is enabled, THE System SHALL provide an endpoint to retrieve historical quiz sessions
2. WHERE progress tracking is enabled, THE Result_Dashboard SHALL display a chart showing score trends over time
3. WHERE progress tracking is enabled, THE System SHALL highlight improvements in behavioral scores between sessions
4. WHERE progress tracking is enabled, THE System SHALL display the date of each previous test session

### Requirement 18: Optional Enhancement - Shareable Results

**User Story:** As a trader, I want to share my results, so that I can discuss my trading psychology with others.

#### Acceptance Criteria

1. WHERE sharing is enabled, THE Result_Dashboard SHALL display a "Share Results" button
2. WHERE sharing is enabled, WHEN the user clicks "Share Results", THE System SHALL generate a shareable image or link
3. WHERE sharing is enabled, THE System SHALL exclude sensitive personal information from shared content
4. WHERE sharing is enabled, THE System SHALL include the personality type and key scores in the shareable content

### Requirement 19: Optional Enhancement - Dynamic Scenario Generation

**User Story:** As a system, I want to generate scenarios dynamically using AI, so that each test experience is unique.

#### Acceptance Criteria

1. WHERE dynamic generation is enabled, THE System SHALL invoke the LLM_API to generate new scenarios
2. WHERE dynamic generation is enabled, THE System SHALL validate that generated scenarios include description, three options, correct answer, and scenario type
3. WHERE dynamic generation is enabled, THE System SHALL ensure generated scenarios are relevant to trading psychology
4. WHERE dynamic generation is enabled, THE System SHALL fall back to predefined scenarios when LLM_API fails

### Requirement 20: Architecture Separation of Concerns

**User Story:** As a developer, I want clear separation between rule-based and AI components, so that the system is maintainable and testable.

#### Acceptance Criteria

1. THE Analytics_Engine SHALL compute all behavioral scores without invoking any AI services
2. THE Personality_Detector SHALL determine personality types using only rule-based logic
3. THE AI_Insight_Generator SHALL be the only component that invokes the LLM_API
4. THE System SHALL never use AI to calculate behavioral scores or determine personality types
5. THE System SHALL treat rule-based analysis as the source of truth for all quantitative metrics
