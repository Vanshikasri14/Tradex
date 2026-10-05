import { useState } from 'react';
import mindProfileAPI from '../services/mindProfileAPI';

export const useMindProfile = () => {
  const [state, setState] = useState({
    currentScreen: 'entry', // 'entry' | 'quiz' | 'results'
    scenarios: [],
    responses: [],
    results: null,
    loading: false,
    error: null
  });

  const startQuiz = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const scenarios = await mindProfileAPI.getScenarios(7);
      setState(prev => ({
        ...prev,
        scenarios,
        currentScreen: 'quiz',
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to load scenarios', 
        loading: false 
      }));
    }
  };

  const submitQuiz = async (responses) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Submit quiz and get analysis
      const quizResult = await mindProfileAPI.submitQuiz(responses, state.scenarios);
      
      // Generate AI insights
      const insights = await mindProfileAPI.generateInsights(quizResult.sessionId);
      
      // Combine results
      const fullResults = {
        ...quizResult,
        ...insights
      };
      
      setState(prev => ({
        ...prev,
        results: fullResults,
        currentScreen: 'results',
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to process quiz', 
        loading: false 
      }));
    }
  };

  const retakeQuiz = () => {
    setState({
      currentScreen: 'entry',
      scenarios: [],
      responses: [],
      results: null,
      loading: false,
      error: null
    });
  };

  return {
    ...state,
    startQuiz,
    submitQuiz,
    retakeQuiz
  };
};
