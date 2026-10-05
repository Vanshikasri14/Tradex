import styles from './ProgressIndicator.module.css';

const ProgressIndicator = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Question {current} of {total}
      </div>
      <div className={styles.barContainer}>
        <div 
          className={styles.barFill} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
