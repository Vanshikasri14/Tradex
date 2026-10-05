import styles from './InsightsSection.module.css';

const InsightsSection = ({ insights, strengths, weaknesses }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>AI Analysis</h3>
      <p className={styles.insights}>{insights}</p>
      
      <div className={styles.grid}>
        <div className={styles.section}>
          <h4 className={styles.subtitle}>✅ Strengths</h4>
          <p className={styles.text}>{strengths}</p>
        </div>
        
        <div className={styles.section}>
          <h4 className={styles.subtitle}>⚠️ Weaknesses</h4>
          <p className={styles.text}>{weaknesses}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
