import { useState } from 'react';
import styles from './EntryScreen.module.css';
import Button from '../Button';

const EntryScreen = ({ onStart }) => {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await onStart();
    } catch (error) {
      console.error('Error starting quiz:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🧠</div>
        <h1 className={styles.title}>Test Your Trading Mindset in 2 Minutes</h1>
        <p className={styles.description}>
          Discover your trading personality through realistic market scenarios. 
          Get personalized insights powered by AI to improve your trading psychology.
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>7 realistic scenarios</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎯</span>
            <span>Behavioral analysis</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🤖</span>
            <span>AI-powered insights</span>
          </div>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={loading}
          className={styles.startButton}
        >
          {loading ? 'Loading...' : 'Start Simulation'}
        </Button>
      </div>
    </div>
  );
};

export default EntryScreen;
