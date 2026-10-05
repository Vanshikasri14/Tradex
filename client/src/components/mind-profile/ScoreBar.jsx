import { useEffect, useState } from 'react';
import styles from './ScoreBar.module.css';

const ScoreBar = ({ label, score, color = 'var(--primary-color)' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.score}>{score}%</span>
      </div>
      <div className={styles.barContainer}>
        <div 
          className={styles.barFill} 
          style={{ 
            width: `${animatedScore}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
