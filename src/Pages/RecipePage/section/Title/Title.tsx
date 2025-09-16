import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Title.module.css";

interface RecipeTitleProps {
    title: string;
}

const Title: React.FC<RecipeTitleProps> = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.titleContainer}>
            {/* Кнопка "Назад" */}
            <button
                onClick={() => navigate("/")}
                className={styles.backButton}
                aria-label="Назад на главную"
            >
                <img src="/arrow-right.svg"></img>
            </button>

            {/* Заголовок */}
            <h1 className={styles.titleText}>{title}</h1>
        </div>
    );
};

export default Title;