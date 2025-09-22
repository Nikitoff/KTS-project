import { createContext, useContext } from "react";
import { RecipeStore } from "../stores/ResipeStore";
import { FavoritesStore } from "../stores/FavoritesStore";

export class RootStore {
    recipeStore = new RecipeStore();
    favoritesStore = new FavoritesStore();

}

export const RootStoreContext = createContext<RootStore>(null!);

export const useStore = () => {
    const context = useContext(RootStoreContext);
    if (!context) throw new Error("useStore must be used within RootStoreProvider");
    return context;

}