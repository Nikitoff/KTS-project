import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./RecipePage.module.scss";
import Loader from "components/ui/Loader";
import IngredientsEquip from "./section/IngredientsEquip/IngredientsEquip";
import Title from "./section/Title/Title";
import RecipeHeader from "./section/ImageHeader/RecipeHeader";
import Directions from "./section/Directions/Directions";
import { useStore } from "stores/RootStore";
import type { Recipe } from "../../types/recipe";
import { observer } from "mobx-react-lite";

const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h} ч ` : ""}${m} мин`;
};

const getFirstImageUrl = (recipe: Recipe): string | null => {
    const images = recipe.images || [];
    return images.length > 0 ? images[0].url : null;
};

const RecipePage = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const navigate = useNavigate();
    const { recipePageStore } = useStore();

    useEffect(() => {
        if (!documentId) return;
        recipePageStore.load(documentId).catch(() => {
            navigate("/");
        });
    }, [documentId, navigate, recipePageStore]);

    if (recipePageStore.loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader size="l" />
            </div>
        );
    }

    if (!recipePageStore.recipe) {
        return <div className={styles.container}>Рецепт не найден</div>;
    }

    const recipe = recipePageStore.recipe;
    return (
        <div className={styles.page}>


            <div className={styles.card}>
                <Title title={recipe.name} />
                <RecipeHeader
                    imageUrl={recipe.images[0]?.url || "https://via.placeholder.com/448x298"}
                    totalTime={recipe.totalTime}
                    CookingTime={recipe.cookingTime}
                    PrepTime={recipe.preparationTime}
                    servings={recipe.servings}
                    likes={recipe.likes}
                    rating={recipe.rating}
                />

                <section className={styles.summaryText}>
                    <div
                        dangerouslySetInnerHTML={{ __html: recipe.summary }}
                    />
                </section>
                <section className={styles.section}>
                    <IngredientsEquip
                        ingredients={recipe.ingradients || []}
                        equipment={recipe.equipments || []}
                    />
                </section>

                <section className={styles.section}>
                    <Directions steps={recipe.directions} />
                </section>
            </div>
        </div>
    );
};

export default observer(RecipePage);