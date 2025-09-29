import React from "react";
import styles from "./directions.module.scss"

interface Step {
    id: number;
    description: string;
}

interface DirectionsProps {
    steps: Step[];
}

const Directions: React.FC<DirectionsProps> = ({ steps }) => {
    return (
        <div className={styles.container}>
            {steps.map((step, index) => (
                <div key={step.id} className={styles.step}>
                    <div className={styles.stepContent}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepLabelText}>Step {index + 1}</span>
                        </div>
                        <div className={styles.stepDescription}>
                            <span className={styles.stepDescriptionText}>{step.description}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Directions;