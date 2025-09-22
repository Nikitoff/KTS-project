import React, { JSX, useEffect } from "react";
import RecipeListSection from "../MainPage/sections/RecipeListSection/RecipeListSection";
import MainImage from "./sections/MainImage/MainImage";
import { reaction } from "mobx";
import { useStore } from "../../stores/RootStore";
import { useSearchParams } from "react-router-dom";

const MainPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipeStore } = useStore();


  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;

    recipeStore.setSearchTerm(search);
    recipeStore.setCategoryId(category);
    recipeStore.setCurrentPage(page);
  }, []);

  return (
    <>
      <MainImage />
      <RecipeListSection />
    </>
  );
};

export default MainPage