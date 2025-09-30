import React, { JSX, useEffect } from "react";
import RecipeListSection from "../MainPage/sections/RecipeListSection/RecipeListSection";
import MainImage from "./sections/MainImage/MainImage";
import { reaction } from "mobx";
import { useStore } from "stores/RootStore";
import { useSearchParams } from "react-router-dom";

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore } = useStore();


  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;


    if (recipeStore && recipeStore.initialized) {
      recipeStore.setSearchTerm(search);
      recipeStore.setCategoryId(category);
      recipeStore.setCurrentPage(page);
    }
  }, [recipeStore, searchParams]);


  useEffect(() => {
    if (!recipeStore) return;


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

    return () => dispose();
  }, [recipeStore, setSearchParams]);


  return (
    <>
      <MainImage />
      <RecipeListSection />
    </>
  );
};

export default MainPage