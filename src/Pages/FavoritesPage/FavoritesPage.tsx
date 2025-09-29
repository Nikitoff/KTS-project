import Button from "components/ui/Button/Button";
import Card from "components/ui/Card/Card";
import styles from "./FavoritesPage.module.scss";
import { useStore } from "stores/RootStore";
import { observer } from "mobx-react-lite";
import { getFirstImageUrl } from "services/api";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
    const { favoritesStore, recipeStore } = useStore();
    const navigate = useNavigate();
    const favoriteRecipes = recipeStore.recipes.filter((recipe) =>
        favoritesStore.isFavorite(recipe.documentId)
    );
    const formatIngredients = (ingredients: any[] | undefined): string => {
        if (!ingredients || !Array.isArray(ingredients)) return "Нет ингредиентов";
        return ingredients
            .map((ing) => `${ing?.name || "Неизвестно"} ${ing?.amount ?? 0}${ing?.unit || ""}`)
            .join(" + ");
    };

    if (favoritesStore.favorites.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Ваши избранные рецепты</h2>
                <p>Вы ещё не сохранили ни одного рецепта.</p>
                <Button className={styles.backBtn} onClick={() => navigate("/")}>На главную</Button>
            </div>
        );
    }

    if (recipeStore.loading) {
        return (
            <div className={styles.loading}>
                <p>Загрузка рецептов...</p>
                <Button className={styles.backBtn} onClick={() => navigate("/")}>На главную</Button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Избранное </h1>
            <div style={{ marginBottom: 16 }}>
                <Button className={styles.backBtn} onClick={() => navigate("/")}>На главную</Button>
            </div>
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
                                <Button
                                    className={styles.deleteBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        favoritesStore.toggle(recipe.documentId);
                                    }}
                                >
                                    <span style={{ color: "white", fontSize: "1.125rem" }}>
                                        Удалить
                                    </span>
                                </Button>
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