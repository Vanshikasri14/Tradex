import { useState, useEffect } from 'react';
import ScenarioCard from './ScenarioCard';
import ProgressIndicator from './ProgressIndicator';
import styles from './ScenarioEngine.module.css';

const ScenarioEngine = ({ scenarios, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  const currentScenario = scenarios[currentIndex];

  const handleResponse = (optionIndex, changedAnswer) => {
    const responseTime = (Date.now() - startTime) / 1000; // Convert to seconds

    const response = {
      scenarioId: currentScenario.id,
      selectedOption: optionIndex + 1, // Convert to 1-based index
      responseTime,
      changedAnswer
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Move to next scenario or complete
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartTime(Date.now()); // Reset timer for next scenario
    } else {
      // Quiz complete
      onComplete(newResponses);
    }
  };

  return (
    <div className={styles.container}>
      <ProgressIndicator 
        current={currentIndex + 1} 
        total={scenarios.length} 
      />
      
      <ScenarioCard
        description={currentScenario.description}
        options={currentScenario.options}
        onSelect={handleResponse}
      />
    </div>
  );
};

export default ScenarioEngine;
