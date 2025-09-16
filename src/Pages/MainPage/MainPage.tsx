import React, { JSX } from "react";
import { RecipeListSection } from "../MainPage/sections/RecipeListSection/RecipeListSection";
import MainImage from "./sections/MainImage/MainImage";

export const MainPage = (): JSX.Element => {
  return (
    <>
      <MainImage />
      <RecipeListSection />
    </>
  );
};

export default MainPage