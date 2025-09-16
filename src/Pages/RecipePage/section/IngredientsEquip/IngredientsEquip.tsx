import React from "react";
import styles from "./IngredientsEquip.module.css";

interface Ingredient {
    id: number | string;
    name: string;
}

interface Equipment {
    id: number | string;
    name: string;
}

interface IngredientsEquipProps {
    ingredients: Ingredient[];
    equipment: Equipment[];
}

const IngredientsEquip: React.FC<IngredientsEquipProps> = ({ ingredients, equipment }) => {
    return (
        <div className={styles.container}>


            {/* Две основные колонки: Ингредиенты и Оборудование */}
            <div className={styles.grid}>
                {/* Левая часть: Ингредиенты в 2 колонки */}
                <div className={styles.columnWrapper}>
                    <h2 className={styles.title}>Ingredients</h2>
                    <div className={styles.twoColumnGrid}>
                        {ingredients.map((ing) => (
                            <div key={ing.id} className={styles.item}>
                                <img src="/IngredientsIcon.svg"></img>
                                <span className={styles.text}>{ing.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Правая часть: Оборудование в 2 колонки */}
                <div className={styles.equipmentWrapper}>
                    <h2 className={styles.title}>Equipment</h2>
                    <div className={styles.twoColumnGrid}>
                        {equipment.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <img src="/EquipIcon.svg"></img>
                                <span className={styles.text}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Разделитель и маркер */}
                <div className={styles.divider}></div>
                <div className={styles.marker}></div>
            </div>
        </div>
    );
};

export default IngredientsEquip;