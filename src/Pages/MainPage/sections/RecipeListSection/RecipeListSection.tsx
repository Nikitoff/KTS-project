import React, { useEffect, JSX, useState } from "react";
import styles from "./RecipeListSection.module.css";
import Input from "components/ui/Input/Input";
import MultiDropdown, { Option } from "components/ui/MultiDropdown/MultiDropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../stores/RootStore";
import { observer } from "mobx-react-lite";
import Card from "components/ui/Card";
import { getFirstImageUrl } from "components/utils/api";

import { reaction } from "mobx";
import Loader from "components/ui/Loader";

const RecipeListSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore, favoritesStore } = useStore();
  const [searchInput, setSearchInput] = useState(recipeStore.searchTerm);

  // Восстановление из URL
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "0";
    const page = Number(searchParams.get("page")) || 1;

    recipeStore.setSearchTerm(search);
    recipeStore.setCategoryId(category);
    recipeStore.setCurrentPage(page);
  }, []);



  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h} ч ` : ""}${m} мин`;
  };

  const formatIngredients = (ingredients: any[] | undefined): string => {
    if (!ingredients || !Array.isArray(ingredients)) return "Нет ингредиентов";
    return ingredients
      .map((ing) => `${ing?.name || "Неизвестно"} ${ing?.amount ?? 0}${ing?.unit || ""}`)
      .join(" + ");
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const totalPages = recipeStore.totalPages;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ page: i, active: i === recipeStore.currentPage });
      }
    } else {
      items.push({ page: 1, active: recipeStore.currentPage === 1 });
      if (recipeStore.currentPage > 3) items.push({ page: "...", active: false });

      const start = Math.max(2, recipeStore.currentPage - 1);
      const end = Math.min(totalPages - 1, recipeStore.currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push({ page: i, active: i === recipeStore.currentPage });
      }

      if (recipeStore.currentPage < totalPages - 2) items.push({ page: "...", active: false });
      items.push({ page: totalPages, active: recipeStore.currentPage === totalPages });
    }

    return items;
  };


  const CATEGORY_OPTIONS = [
    { key: "", value: "Все категории" },
    ...recipeStore.categories.map((cat: any) => ({
      key: String(cat.id),
      value: cat.title,

    })),

  ];

  if (recipeStore.loading && recipeStore.recipes.length === 0) {
    return <Loader />;
  }



  // Кнопка "Поиск"
  const handleSearchClick = () => {
    recipeStore.setSearchTerm(searchInput);
    recipeStore.setCurrentPage(1); // сброс на первую страницу
  };



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
        <div className={styles.searchRow}>
          <Input
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Enter dishes"
            className={styles.searchInput}
            afterSlot={
              <button
                type="button"
                onClick={handleSearchClick}
                className={styles.searchButton}
              >
                <img src="/Search.svg" alt="Search" width="24" height="24" />
              </button>
            }
          />
        </div>

        <div className={styles.dropdownRow}>
          {recipeStore.categories.length > 0 ? (
            <MultiDropdown
              options={CATEGORY_OPTIONS}
              value={
                recipeStore.categoryId
                  ? [{ key: recipeStore.categoryId, value: "" }]
                  : [{ key: "", value: "Все категории" }]
              }
              onChange={(options) => {
                const selectedKey = options[0]?.key || ""; // ← если нет выбора — ""
                recipeStore.setCategoryId(selectedKey);   // сохраняем ""
              }}
              getTitle={() => {
                const selected = CATEGORY_OPTIONS.find(
                  (opt) => opt.key === recipeStore.categoryId
                );
                return selected?.value || "Все категории";
              }}
              placeholder="Выберите категорию"
              className={styles.categoryDropdown}
            />
          ) : (
            <Loader></Loader>
          )}
        </div>
      </div>

      {/* Сетка карточек */}
      <div className={styles.cardsGrid}>
        {recipeStore.recipes.map((recipe) => {
          const imageUrl = getFirstImageUrl(recipe) || "https://via.placeholder.com/360x180?text=No+Image";

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
                    e.stopPropagation();
                    favoritesStore.toggle(recipe.documentId);
                  }}
                >
                  <span style={{ color: "white", fontSize: "1.125rem" }}>
                    {favoritesStore.isFavorite(recipe.documentId) ? "Saved" : "Save"}
                  </span>
                </button>
              }
              onClick={() => navigate(`/recipe/${recipe.documentId}`)}
              className="w-full"
            />
          );
        })}
      </div>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => recipeStore.setCurrentPage(recipeStore.currentPage - 1)}
          disabled={recipeStore.currentPage === 1}
          aria-label="Previous page"
        >
          <img src='/arrowleft.svg' alt="Previous" width="32" height="32" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {renderPaginationItems().map((item, index) => (
            <div key={index}>
              {item.page === "..." ? (
                <span className={styles.dots}>...</span>
              ) : (
                <button
                  className={`${styles.pageNumber} ${item.active ? styles["pageNumber active"] : ""}`}
                  onClick={() => recipeStore.setCurrentPage(Number(item.page))}
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
          onClick={() => recipeStore.setCurrentPage(recipeStore.currentPage + 1)}
          disabled={recipeStore.currentPage >= recipeStore.totalPages}
          aria-label="Next page"
        >
          <img src='/arrowright.svg' alt="Next" width="32" height="32" />
        </button>
      </div>
    </section>
  );
};

export default observer(RecipeListSection);