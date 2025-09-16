import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, Recipe } from "../../components/utils/api"; // убедись, что есть getRecipeById
import styles from "./RecipePage.module.css";
import Text from "components/ui/Text/Text";
import Loader from "components/ui/Loader";
import IngredientsEquip from "./section/IngredientsEquip/IngredientsEquip";
import Title from "./section/Title/Title";
import RecipeHeader from "./section/ImageHeader/RecipeHeader";
import Directions from "./section/Directions/Directions";

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
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) return;

        const loadRecipe = async () => {
            setLoading(true);
            try {
                const data = await getRecipeById(documentId);
                setRecipe(data);
            } catch (err) {
                console.error("Ошибка загрузки рецепта:", err);
                alert("Рецепт не найден");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [documentId, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader size="l" />
            </div>
        );
    }

    if (!recipe) {
        return <div className={styles.container}>Рецепт не найден</div>;
    }

    return (
        <div className={styles.page}>


            {/* Основная карточка */}
            <div className={styles.card}>
                {/* Заголовок */}
                <Title title={recipe.name} />

                {/* Изображение и данные */}
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

                {/* Ингредиенты и оборудование */}
                <section className={styles.section}>
                    <IngredientsEquip
                        ingredients={recipe.ingradients || []}
                        equipment={recipe.equipments || []}
                    />
                </section>

                {/* Пошаговая инструкция */}
                <section className={styles.section}>
                    <Directions steps={recipe.directions} />
                </section>
            </div>
        </div>
    );
};

export default RecipePage;