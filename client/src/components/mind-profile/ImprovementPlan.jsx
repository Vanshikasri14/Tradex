import styles from './ImprovementPlan.module.css';

const ImprovementPlan = ({ plan }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎯 Improvement Plan</h3>
      <ul className={styles.list}>
        {plan.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.bullet}>•</span>
            <span className={styles.text}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImprovementPlan;
