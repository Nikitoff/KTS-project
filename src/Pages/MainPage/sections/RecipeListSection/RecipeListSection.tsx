import React, { useEffect, useState } from "react";
import styles from "./RecipeListSection.module.scss";
import Input from "components/ui/Input/Input";
import MultiDropdown, { Option } from "components/ui/MultiDropdown/MultiDropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "stores/RootStore";
import { observer } from "mobx-react-lite";
import Card from "components/ui/Card";
import { getFirstImageUrl } from "services/api";
import Loader from "components/ui/Loader";
import Pagination from "components/ui/Pagination/Pagination";

const RecipeListSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore, favoritesStore } = useStore();
  const [searchInput, setSearchInput] = useState(recipeStore.searchTerm);


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

  const changePage = (page: number) => recipeStore.setCurrentPage(page);


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




  const handleSearchClick = () => {
    recipeStore.setSearchTerm(searchInput);
    recipeStore.setCurrentPage(1); // сброс на первую страницу
  };



  return (
    <section className={styles.container}>

      <div className={styles.headerText}>
        Find the perfect food and{" "}
        <span className={styles.underline}>drink ideas</span> for every occasion, from{" "}
        <span className={styles.underline}>weeknight dinners</span> to{" "}
        <span className={styles.underline}>holiday feasts</span>.
      </div>


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
                const selectedKey = options[0]?.key || "";
                recipeStore.setCategoryId(selectedKey);
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
                  className={styles.saveBtn}
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


      <Pagination
        current={recipeStore.currentPage}
        total={recipeStore.totalPages}
        onChange={changePage}
        prevIcon={<img src='/arrowleft.svg' alt="Previous" width="32" height="32" />}
        nextIcon={<img src='/arrowright.svg' alt="Next" width="32" height="32" />}
        className={styles.pagination}
        pageClassName={styles.pageNumber}
        dotsClassName={styles.dots}
      />
    </section>
  );
};

export default observer(RecipeListSection);