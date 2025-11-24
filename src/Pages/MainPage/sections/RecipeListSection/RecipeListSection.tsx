import React, { useState, useEffect, JSX } from "react";
import styles from "./RecipeListSection.module.css";
import Input from "components/ui/Input/Input";
import MultiDropdown from "components/ui/MultiDropdown/MultiDropdown";
import { Option } from "components/ui/MultiDropdown/MultiDropdown";
import { useNavigate } from "react-router-dom";

// Импортируем ваши функции
import {
  getRecipes,
  RecipeFilters,
  getFirstImageUrl,
  Recipe,
} from "../../../../components/utils/api";
import Card from "../../../../components/ui/Card"; // ваш кастомный Card
import Button from "components/ui/Button/Button";


const CATEGORY_OPTIONS = [
  { key: "all", value: "Все категории" },
  { key: "Breakfast", value: "Breakfast" },
  { key: "Lunch", value: "Lunch" },
  { key: "Dinner", value: "Dinner" },
  { key: "Dessert", value: "Dessert" },
];
// Простые SVG стрелки вместо lucide-react
const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const RecipeListSection = (): JSX.Element => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  const navigate = useNavigate();

  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h} ч ` : ""}${m} мин`;
  };

  const formatIngredients = (ingredients: any[] | undefined): string => {
    if (!ingredients || !Array.isArray(ingredients)) return "Нет ингредиентов";
    return ingredients
      .map((ing) => {
        const name = ing?.name || "Неизвестно";
        const amount = ing?.amount ?? 0;
        const unit = ing?.unit || "";
        return `${name} ${amount}${unit}`;
      })
      .join(" + ");
  };

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: RecipeFilters = {};
      if (searchTerm) filters.name = searchTerm;
      if (category && category !== "all") filters.category = category;

      const response = await getRecipes({
        ...filters,
        page: currentPage,
        pageSize,
      });

      if (Array.isArray(response.data)) {
        setRecipes(response.data);
        setTotalPages(response.meta.pagination.pageCount || 1);
      } else {
        throw new Error("Некорректные данные от API");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
      setRecipes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category]);

  useEffect(() => {
    loadRecipes();
  }, [currentPage, searchTerm, category]);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ page: i, active: i === currentPage });
      }
    } else {
      items.push({ page: 1, active: currentPage === 1 });
      if (currentPage > 3) items.push({ page: "...", active: false });

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push({ page: i, active: i === currentPage });
      }

      if (currentPage < totalPages - 2) items.push({ page: "...", active: false });
      items.push({ page: totalPages, active: currentPage === totalPages });
    }

    return items;
  };

  if (loading)
    return (
      <div className={`${styles.loadingError}`}>Загрузка рецептов...</div>
    );
  if (error)
    return (
      <div className={`${styles.loadingError} ${styles.errorText}`}>
        Ошибка: {error}
      </div>
    );

  return (
    <section className={styles.container}>
      {/* Заголовок */}
      <div className={styles.headerText}>
        Find the perfect food and{" "}
        <span className={styles.underline}>drink ideas</span> for every occasion, from{" "}
        <span className={styles.underline}>weeknight dinners</span> to{" "}
        <span className={styles.underline}>holiday feasts</span>.
      </div>

      {/* Поиск и фильтр */}
      <div className={styles.filters}>
        {/* Строка 1: инпут + кнопка */}
        <div className={styles.searchRow}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Enter dishes"
            className={styles.searchInput}
            afterSlot={
              <button
                type="button"
                onClick={() => loadRecipes()}
                className={styles.searchButton}
              >
                <img src="/Search.svg"></img>
              </button>
            }
          />
        </div>

        {/* Строка 2: дропдаун */}
        <div className={styles.dropdownRow}>
          <MultiDropdown
            options={CATEGORY_OPTIONS}
            value={selectedCategories}
            onChange={(options) => {
              setSelectedCategories(options);
              setCategory(options[0]?.key || "");
            }}
            getTitle={(value) => value.map(v => v.value).join(", ") || "Все категории"}
            placeholder="Выберите категорию"
            className={styles.categoryDropdown}
          />
        </div>
      </div>
      {/* Сетка карточек */}
      <div className={styles.cardsGrid}>
        {recipes.map((recipe) => {
          const imageUrl =
            getFirstImageUrl(recipe) || "https://via.placeholder.com/360x180?text=No+Image";

          return (
            <Card
              key={recipe.documentId}
              image={imageUrl}
              captionSlot={formatTime(recipe.totalTime)}
              title={recipe.name}
              subtitle={formatIngredients(recipe.ingradients)}
              contentSlot={<span>{recipe.calories} kcal</span>}
              actionSlot={
                <button
                  style={{
                    minHeight: "52px",
                    padding: "0.875rem 1.25rem",
                    backgroundColor: "#b5460f",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // чтобы не срабатывал onClick на самой карточке
                    console.log("Сохраняем рецепт:", recipe.name);
                  }}
                >
                  <span style={{ color: "white", fontSize: "1.125rem" }}>Save</span>
                </button>
              }
              onClick={() => {
                console.log("Переход к рецепту с ID:", recipe.documentId);
                navigate(`/recipe/${recipe.documentId}`)
              }
              }
              className="w-full"
            />
          );
        })}
      </div>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {renderPaginationItems().map((item, index) => (
            <div key={index}>
              {item.page === "..." ? (
                <span className={styles.dots}>...</span>
              ) : (
                <button
                  className={`${styles.pageNumber} ${item.active ? styles["pageNumber active"] : ""}`}
                  onClick={() => setCurrentPage(Number(item.page))}
                  disabled={item.active}
                >
                  {item.page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};