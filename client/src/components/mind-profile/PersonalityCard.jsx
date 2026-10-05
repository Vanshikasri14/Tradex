import styles from './PersonalityCard.module.css';

const PersonalityCard = ({ personality, description, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{personality}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default PersonalityCard;
