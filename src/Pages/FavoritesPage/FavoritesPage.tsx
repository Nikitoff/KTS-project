import React, { useEffect } from "react";
import styles from "../FavoritesPage/FavoritesPage.module.css";
import { useStore } from "../../stores/RootStore";
import { observer } from "mobx-react-lite";
import Card from "components/ui/Card";
import { getFirstImageUrl } from "components/utils/api";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
    const { favoritesStore, recipeStore } = useStore();
    const navigate = useNavigate();
    // Фильтруем сохранённые рецепты из общего списка
    const favoriteRecipes = recipeStore.recipes.filter((recipe) =>
        favoritesStore.isFavorite(recipe.documentId)
    );
    const formatIngredients = (ingredients: any[] | undefined): string => {
        if (!ingredients || !Array.isArray(ingredients)) return "Нет ингредиентов";
        return ingredients
            .map((ing) => `${ing?.name || "Неизвестно"} ${ing?.amount ?? 0}${ing?.unit || ""}`)
            .join(" + ");
    };

    // Альтернатива: если нужно подгружать каждый рецепт отдельно (если нет в основном списке)
    // Но пока используем то, что уже загружено

    if (favoritesStore.favorites.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Ваши избранные рецепты</h2>
                <p>Вы ещё не сохранили ни одного рецепта.</p>
            </div>
        );
    }

    if (favoriteRecipes.length === 0) {
        return (
            <div className={styles.loading}>
                <p>Загрузка рецептов...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Избранное ❤️</h1>
            <div className={styles.cardsGrid}>
                {favoriteRecipes.map((recipe) => {
                    const imageUrl = getFirstImageUrl(recipe) || "https://via.placeholder.com/360x180?text=No+Image";

                    return (
                        <Card
                            key={recipe.documentId}
                            image={imageUrl}
                            captionSlot={`${recipe.totalTime} мин`}
                            title={recipe.name}
                            subtitle={formatIngredients(recipe.ingradients)}
                            contentSlot={<span>{recipe.calories} kcal</span>}
                            actionSlot={
                                <button
                                    style={{
                                        minHeight: "52px",
                                        padding: "0.875rem 1.25rem",
                                        backgroundColor: "#d9534f",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        favoritesStore.toggle(recipe.documentId);
                                    }}
                                >
                                    <span style={{ color: "white", fontSize: "1.125rem" }}>
                                        Удалить
                                    </span>
                                </button>
                            }
                            onClick={() => navigate(`/recipe/${recipe.documentId}`)}
                            className="w-full"
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default observer(FavoritesPage);