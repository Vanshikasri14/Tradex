import styles from './PredictionCard.module.css';

const PredictionCard = ({ prediction }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>🔮</div>
      <h3 className={styles.title}>Market Prediction</h3>
      <p className={styles.prediction}>{prediction}</p>
    </div>
  );
};

export default PredictionCard;
