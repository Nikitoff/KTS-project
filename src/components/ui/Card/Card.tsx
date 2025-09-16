import React from "react";
import styles from "./Card.module.css";

export type CardProps = {
    className?: string;
    image: string;
    captionSlot?: React.ReactNode;
    title: React.ReactNode;
    subtitle: React.ReactNode;
    contentSlot?: React.ReactNode; // например, цена
    actionSlot?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const Card: React.FC<CardProps> = ({
    className = "",
    image,
    captionSlot,
    title,
    subtitle,
    contentSlot,
    actionSlot,
    onClick,
}) => {
    return (
        <div
            className={`${styles.card} ${className}`.trim()}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();

                }
            }}
        >
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.cardImagePlaceholder} />
                <img src={image} alt="recipe" className={styles.cardImage} />
            </div>

            {/* Body */}
            <div className={styles.cardBody}>
                <div className={styles.cardContent}>
                    {captionSlot && <div className={styles.cardCaption}>{captionSlot}</div>}
                    <div className={styles.cardTitle}>{title}</div>
                    <div className={styles.cardSubtitle}>{subtitle}</div>
                </div>

                <div className={styles.cardBottom}>
                    <div className={styles.cardPrice}>{contentSlot}</div>
                    {actionSlot ? (
                        actionSlot
                    ) : (
                        <button type="button" className={styles.cardButton}>
                            <span className={styles.cardButtonText}>Save</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;