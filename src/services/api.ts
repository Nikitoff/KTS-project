import axios from 'axios';
import qs from 'qs';
import { Recipe, PaginatedResponse, RecipeFilters } from '../types/recipe';

const STRAPI_BASE_URL = 'https://front-school-strapi.ktsdev.ru';
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;
const API_TOKEN = 'f53a84efed5478ffc79d455646b865298d6531cf8428a5e3157fa5572c6d3c51739cdaf3a28a4fdf8b83231163075ef6a8435a774867d035af53717fecd37bca814c6b7938f02d2893643e2c1b6a2f79b3ca715222895e8ee9374c0403d44081e135cda1f811fe7cfec6454746a5657ba070ec8456462f8ca0e881232335d1ef';

export const api = axios.create({
    baseURL: STRAPI_API_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

export const getRecipes = async (
    filters: RecipeFilters = {}
): Promise<PaginatedResponse> => {
    const { name, category, page = 1, pageSize = 9 } = filters;

    const queryParams = {
        populate: ['images', 'ingradients', 'category'],
        pagination: { page, pageSize },
        filters: {} as Record<string, any>,
    };

    if (name) queryParams.filters.name = { $containsi: name };
    if (category) queryParams.filters.category = { title: { $eq: category } };

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const url = `/recipes?${queryString}`;
    const response = await api.get<PaginatedResponse>(url);
    return response.data;
};

export const getRecipeById = async (documentId: string): Promise<Recipe> => {
    const queryParams = {
        populate: ['images', 'ingradients', 'category', 'directions', 'equipments'],
    };
    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const url = `/recipes/${documentId}?${queryString}`;
    const response = await api.get<{ data: Recipe }>(url);
    if (!response.data.data) throw new Error('Рецепт не найден');
    return response.data.data;
};

export function getFirstImageUrl(recipe: Recipe): string | null {
    return recipe.images?.[0]?.url || null;
}

export default api;


