import React, { JSX, useEffect } from "react";
import RecipeListSection from "../MainPage/sections/RecipeListSection/RecipeListSection";
import MainImage from "./sections/MainImage/MainImage";
import { reaction } from "mobx";
import { useStore } from "../../stores/RootStore";
import { useSearchParams } from "react-router-dom";

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore } = useStore();

  // 🔁 Восстановление из URL при загрузке
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;

    recipeStore.setSearchTerm(search);
    recipeStore.setCategoryId(category);
    recipeStore.setCurrentPage(page);
  }, []);

  // 🔄 Синхронизация стора → URL
  useEffect(() => {
    if (!recipeStore) return;

    // reaction будет пересоздан при каждом ререндере? Нет!
    // Но мы его правильно очистим
    const dispose = reaction(
      () => ({
        search: recipeStore.searchTerm,
        category: recipeStore.categoryId,
        page: recipeStore.currentPage,
      }),
      (params) => {
        const newParams: Record<string, string> = {};

        if (params.search) newParams.search = params.search;
        if (params.category && params.category !== "" && params.category !== "0") {
          newParams.category = params.category;
        }
        if (params.page > 1) newParams.page = String(params.page);

        setSearchParams(newParams);
      }
    );

    return () => dispose(); // ✅ очистка при размонтировании
  }, [recipeStore, setSearchParams]);


  return (
    <>
      <MainImage />
      <RecipeListSection />
    </>
  );
};

export default MainPage