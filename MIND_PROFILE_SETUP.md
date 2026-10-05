# Trader Mind Profile - Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your Free Groq API Key

1. Go to https://console.groq.com
2. Sign up for a free account (no credit card required)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### Step 2: Add API Key to Environment

Add this line to your `server/.env` file:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### Step 3: Run Database Migrations

```bash
cd server
node database/runMindProfileMigrations.js
```

You should see:
```
🚀 Starting Mind Profile migrations...
✅ Successfully executed: 034_create_scenarios_table.sql
✅ Successfully executed: 035_create_quiz_sessions_table.sql
✅ Successfully executed: 036_create_quiz_responses_table.sql
🎉 All Mind Profile migrations completed successfully!
```

### Step 4: Start Your Application

```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

### Step 5: Test the Feature

1. Sign in to your Tradex account
2. Click "Mind Profile" in the sidebar (brain icon 🧠)
3. Click "Start Simulation"
4. Answer 7 trading scenarios
5. View your personalized results!

## What You Get

- **Behavioral Analysis**: 6 scores (Risk, Discipline, Confidence, Fear, Revenge, Hesitation)
- **Personality Type**: One of 6 trading personalities
- **AI Insights**: Personalized analysis of your trading psychology
- **Market Prediction**: How you'll behave in future market conditions
- **Improvement Plan**: 3 actionable steps to improve

## Groq Model Details

- **Model**: Llama 3.1 70B Versatile
- **Speed**: Extremely fast (< 1 second response)
- **Quality**: High-quality insights
- **Free Tier**: Very generous limits
- **Cost**: $0 (completely free)

## Troubleshooting

### "GROQ_API_KEY not found"
- Make sure you added the key to `server/.env`
- Restart your server after adding the key

### "Migration failed"
- Check your database connection
- Make sure PostgreSQL is running
- Verify DATABASE_URL in your .env

### "AI insights not loading"
- Check server logs for errors
- Verify your Groq API key is valid
- The feature will show fallback insights if AI fails

## Alternative Models (Optional)

If you want to try different models, edit `server/services/aiInsightGenerator.js`:

```javascript
// Faster but smaller model
this.model = 'llama-3.1-8b-instant';

// Balanced (current default)
this.model = 'llama-3.1-70b-versatile';

// Alternative: Mixtral
this.model = 'mixtral-8x7b-32768';
```

## Feature Architecture

```
Frontend (React)
├── Entry Screen → Scenario Engine → Results Dashboard
└── 7 interactive scenarios with timing tracking

Backend (Node.js)
├── Rule-Based Analytics (deterministic scoring)
├── Personality Detection (6 personality types)
└── AI Insight Generator (Groq/Llama 3.1)

Database (PostgreSQL)
├── scenarios (10 pre-loaded scenarios)
├── quiz_sessions (user results)
└── quiz_responses (detailed tracking)
```

## Support

If you encounter any issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set
3. Ensure database migrations completed successfully
4. Test with a simple Groq API call to verify your key works

Enjoy your new Mind Profile feature! 🎯
