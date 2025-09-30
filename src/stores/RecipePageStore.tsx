import { makeAutoObservable } from "mobx";
import { Recipe } from "../types/recipe";
import { getRecipeById } from "services/api";

export class RecipePageStore {
    recipe: Recipe | null = null;
    loading = false;
    error: string | null = null;
    private lastRequestedId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    load = async (documentId: string) => {
        if (!documentId) return;
        this.lastRequestedId = documentId;
        this.loading = true;
        this.error = null;
        this.recipe = null;
        try {
            const data = await getRecipeById(documentId);
            if (this.lastRequestedId === documentId) {
                this.recipe = data;
            }
        } catch (e: any) {
            if (this.lastRequestedId === documentId) {
                this.error = e?.message ?? 'Ошибка';
                this.recipe = null;
            }
        } finally {
            if (this.lastRequestedId === documentId) {
                this.loading = false;
            }
        }
    };
}

export default RecipePageStore;

