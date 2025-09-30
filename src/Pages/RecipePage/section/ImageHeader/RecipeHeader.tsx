import React from "react";
import styles from "./RecipeHeader.module.scss";

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

            <img
                src={imageUrl}
                alt="Рецепт"
                className={styles.image}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/448x298?text=No+Image";
                }}
            />

            <div className={styles.infoGrid}>

                <div className={styles.stat}>
                    <span className={styles.statLabel}>Preparation</span>
                    <span className={styles.statValue}>{PrepTime + ' minutes'}</span>
                </div>


                <div className={styles.stat}>
                    <span className={styles.statLabel}>Cooking</span>
                    <span className={styles.statValue}>{CookingTime + ' minutes'}</span>
                </div>


                <div className={styles.stat}>
                    <span className={styles.statLabel}>Total</span>
                    <span className={styles.statValue}>{totalTime + ' minutes'}</span>
                </div>


                <div className={styles.stat}>
                    <span className={styles.statLabel}>Лайки</span>
                    <span className={styles.statValue}>{likes}</span>
                </div>

                <div className={styles.stat}>
                    <span className={styles.statLabel}>Servings</span>
                    <span className={styles.statValue}>{servings + ' servings'}</span>
                </div>


                <div className={styles.stat}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue}>{rating}</span>
                </div>
            </div>
        </div>
    );
};

export default RecipeHeader;