import { makeAutoObservable } from "mobx";
import qs from "qs";
import { Recipe } from "../types/recipe";
import api from "services/api";

export class RecipeStore {
    recipes: Recipe[] = [];
    categories: any[] = [];
    loading = false;
    error: string | null = null;

    searchTerm = "";
    categoryId = "";
    currentPage = 1;
    pageSize = 9;
    totalPages = 1;

    constructor() {
        makeAutoObservable(this);
        this.loadCategories();
        this.loadRecipes();
    }

    loadRecipes = async () => {
        this.loading = true;
        this.error = null;

        try {
            const queryParams = {
                populate: ["images", "ingradients"],
                filters: {
                    ...(this.searchTerm && { name: { $containsi: this.searchTerm } }),
                    ...(this.categoryId && !isNaN(Number(this.categoryId)) && {
                        category: { id: { $eq: Number(this.categoryId) } },
                    }),
                },
                pagination: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            } as const;

            const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
            const response = await api.get(`/recipes?${queryString}`);

            this.recipes = response.data.data || [];
            this.totalPages = response.data.meta?.pagination?.pageCount || 1;
        } catch (err: any) {
            this.error = err.response?.data?.error?.message || err.message;
            this.recipes = [];
            this.totalPages = 1;
        } finally {
            this.loading = false;
        }
    };

    loadCategories = async () => {
        try {
            const response = await api.get("/meal-categories", { params: { populate: "*" } });
            this.categories = response.data.data || [];
        } catch (err) {
            console.error("Ошибка загрузки категорий:", err);
        }
    };

    setSearchTerm = (value: string) => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.loadRecipes();
    };

    setCategoryId = (value: string) => {
        this.categoryId = value;
        this.currentPage = 1;
        this.loadRecipes();
    };

    setCurrentPage = (page: number) => {
        this.currentPage = page;
        this.loadRecipes();
    };
}

export default RecipeStore;

