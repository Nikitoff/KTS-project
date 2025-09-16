import React from "react";
import styles from "./Recipeheader.module.css";

interface RecipeHeaderProps {
    imageUrl: string;
    totalTime: number;
    CookingTime: number
    PrepTime: number
    servings: number;
    likes: number;
    rating: number;
}

const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h} ч ` : ""}${m} мин`;
};

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    imageUrl,
    totalTime,
    CookingTime,
    PrepTime,
    servings,
    likes,
    rating,
}) => {
    return (
        <div className={styles.container}>
            {/* Главное изображение */}
            <img
                src={imageUrl}
                alt="Рецепт"
                className={styles.image}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/448x298?text=No+Image";
                }}
            />

            {/* Статистика */}
            <div className={styles.infoGrid}>
                {/* Время приготовления */}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Preparation</span>
                    <span className={styles.statValue}>{PrepTime + ' minutes'}</span>
                </div>

                {/* Порции */}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Cooking</span>
                    <span className={styles.statValue}>{CookingTime + ' minutes'}</span>
                </div>

                {/* Калории */}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Total</span>
                    <span className={styles.statValue}>{totalTime + ' minutes'}</span>
                </div>

                {/* Лайки */}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Лайки</span>
                    <span className={styles.statValue}>{likes}</span>
                </div>

                <div className={styles.stat}>
                    <span className={styles.statLabel}>Servings</span>
                    <span className={styles.statValue}>{servings + ' servings'}</span>
                </div>

                {/* Рейтинг */}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue}>{rating}</span>
                </div>
            </div>
        </div>
    );
};

export default RecipeHeader;