import { useMindProfile } from '../hooks/useMindProfile';
import EntryScreen from '../components/mind-profile/EntryScreen';
import ScenarioEngine from '../components/mind-profile/ScenarioEngine';
import ResultsDashboard from '../components/mind-profile/ResultsDashboard';
import LoadingScreen from '../components/LoadingScreen';
import styles from './MindProfilePage.module.css';

const MindProfilePage = () => {
  const {
    currentScreen,
    scenarios,
    results,
    loading,
    error,
    startQuiz,
    submitQuiz,
    retakeQuiz
  } = useMindProfile();

  if (loading) {
    return <LoadingScreen message="Processing your responses..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={retakeQuiz}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {currentScreen === 'entry' && (
        <EntryScreen onStart={startQuiz} />
      )}

      {currentScreen === 'quiz' && (
        <ScenarioEngine 
          scenarios={scenarios}
          onComplete={submitQuiz}
        />
      )}

      {currentScreen === 'results' && results && (
        <ResultsDashboard 
          results={results}
          onRetake={retakeQuiz}
        />
      )}
    </div>
  );
};

export default MindProfilePage;
