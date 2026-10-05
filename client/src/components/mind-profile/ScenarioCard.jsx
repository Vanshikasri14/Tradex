import { useState, useEffect } from 'react';
import styles from './ScenarioCard.module.css';

const ScenarioCard = ({ description, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);

  const handleSelect = (index) => {
    if (selectedOption !== null && selectedOption !== index) {
      setHasChanged(true);
    }
    setSelectedOption(index);
    
    // Auto-advance after selection with slight delay
    setTimeout(() => {
      onSelect(index, hasChanged || (selectedOption !== null && selectedOption !== index));
    }, 300);
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.options}>
        {options.map((option, index) => (
          <button
            key={index}
            className={`${styles.option} ${selectedOption === index ? styles.selected : ''}`}
            onClick={() => handleSelect(index)}
            disabled={selectedOption !== null}
          >
            <span className={styles.optionNumber}>{index + 1}</span>
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioCard;
