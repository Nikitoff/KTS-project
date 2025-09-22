import { makeAutoObservable } from "mobx";
import axios from "axios";
import qs from "qs";
import { Recipe } from "../components/utils/api";



const STRAPI_BASE_URL = 'https://front-school-strapi.ktsdev.ru';
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;
const API_TOKEN = 'f53a84efed5478ffc79d455646b865298d6531cf8428a5e3157fa5572c6d3c51739cdaf3a28a4fdf8b83231163075ef6a8435a774867d035af53717fecd37bca814c6b7938f02d2893643e2c1b6a2f79b3ca715222895e8ee9374c0403d44081e135cda1f811fe7cfec6454746a5657ba070ec8456462f8ca0e881232335d1ef';

if (!API_TOKEN) {
    console.error('❌ Ошибка: API_TOKEN не задан.');
}

const api = axios.create({
    baseURL: STRAPI_API_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
    },
});
export class RecipeStore {
    recipes: Recipe[] = [];
    categories = [];
    loading = false;
    error = null;

    searchTerm = "";
    categoryId = "";
    currentPage = 1;
    pageSize = 9;
    totalPages = 6;

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
            };

            const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
            const response = await api.get(`/recipes?${queryString}`);

            this.recipes = response.data.data || [];
            this.totalPages = response.data.meta?.pagination?.pageCount;
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
            const response = await api.get("/meal-categories", {
                params: { populate: "*" },
            });
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