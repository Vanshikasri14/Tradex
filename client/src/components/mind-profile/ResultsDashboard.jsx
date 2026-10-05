import PersonalityCard from './PersonalityCard';
import ScoreBar from './ScoreBar';
import InsightsSection from './InsightsSection';
import PredictionCard from './PredictionCard';
import ImprovementPlan from './ImprovementPlan';
import Button from '../Button';
import styles from './ResultsDashboard.module.css';

const ResultsDashboard = ({ results, onRetake }) => {
  const { 
    personality, 
    personalityDescription, 
    personalityIcon,
    scores, 
    aiInsights, 
    strengths, 
    weaknesses, 
    prediction, 
    improvementPlan 
  } = results;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PersonalityCard 
          personality={personality}
          description={personalityDescription}
          icon={personalityIcon}
        />

        <div className={styles.scoresSection}>
          <h3 className={styles.sectionTitle}>Behavioral Scores</h3>
          <ScoreBar label="Risk Tolerance" score={scores.risk_score} color="#f59e0b" />
          <ScoreBar label="Discipline" score={scores.discipline_score} color="#10b981" />
          <ScoreBar label="Confidence" score={scores.confidence_score} color="#3b82f6" />
          <ScoreBar label="Fear Level" score={scores.fear_score} color="#ef4444" />
          <ScoreBar label="Revenge Trading" score={scores.revenge_score} color="#dc2626" />
          <ScoreBar label="Hesitation" score={scores.hesitation_score} color="#f97316" />
        </div>

        <InsightsSection 
          insights={aiInsights}
          strengths={strengths}
          weaknesses={weaknesses}
        />

        <PredictionCard prediction={prediction} />

        <ImprovementPlan plan={improvementPlan} />

        <div className={styles.actions}>
          <Button onClick={onRetake} variant="secondary">
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
