import axios from 'axios';
import qs from 'qs';

// 🔧 Базовый URL (убраны пробелы!)
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

// ———————————————————————————————
// Интерфейсы (соответствуют реальной структуре API)
// ———————————————————————————————

export interface UploadFile {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, any>;
  folder?: {
    id: number;
    documentId: string;
    name: string;
    pathId: number;
    parent?: { id: number; documentId: string };
    children?: Array<{ id: number; documentId: string }>;
    files?: Array<UploadFile>;
    path: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    createdBy?: UserRelation;
    updatedBy?: UserRelation;
    locale: string;
    localizations?: Array<{ id: number; documentId: string }>;
  };
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy?: UserRelation;
  updatedBy?: UserRelation;
  locale: string;
  localizations?: Array<{ id: number; documentId: string }>;
}

interface UserRelation {
  id: number;
  documentId: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  isActive?: boolean;
  blocked?: boolean;
  preferedLanguage?: string;
  roles?: Array<{
    id: number;
    documentId: string;
    name: string;
    code: string;
    description: string;
    users?: Array<{ id: number; documentId: string }>;
    permissions?: Array<any>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    createdBy?: UserRelation;
    updatedBy?: UserRelation;
    locale: string;
    localizations?: Array<{ id: number; documentId: string }>;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy?: UserRelation;
  updatedBy?: UserRelation;
  locale: string;
  localizations?: Array<{ id: number; documentId: string }>;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

interface Direction {
  id: number;
  description: string;
  image: UploadFile;
}

interface Equipment {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  documentId: string;
  title: string;
  image: UploadFile;
  recipes: Recipe[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy?: UserRelation;
  updatedBy?: UserRelation;
  locale: string;
  localizations?: Array<{ id: number; documentId: string }>;
}

export interface Recipe {
  id: number;
  documentId: string;
  name: string;
  totalTime: number;
  cookingTime: number;
  preparationTime: number;
  servings: number;
  likes: number;
  images: UploadFile[];
  ingradients: Ingredient[]; // ← опечатка в API!
  directions: Direction[];
  equipments: Equipment[];
  calories: number;
  category: Category;
  rating: number;
  summary: string;
  vegetarian: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy?: UserRelation;
  updatedBy?: UserRelation;
  locale: string;
  localizations?: Array<{ id: number; documentId: string }>;
}

export interface PaginatedResponse {
  data: Recipe[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface RecipeFilters {
  name?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

// ———————————————————————————————
// Утилиты
// ———————————————————————————————

export function getFirstImageUrl(recipe: Recipe): string | null {
  return recipe.images?.[0]?.url;
}

// ———————————————————————————————
// API-функции
// ———————————————————————————————

export const getRecipes = async (
  filters: RecipeFilters = {}
): Promise<PaginatedResponse> => {
  const { name, category, page = 1, pageSize = 9 } = filters;

  const queryParams = {
    populate: ['images', 'ingradients', 'category'],
    pagination: { page, pageSize },
    filters: {} as Record<string, any>,
  };

  if (name) {
    queryParams.filters.name = { $containsi: name };
  }

  if (category) {
    queryParams.filters.category = { title: { $eq: category } };
  }

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const url = `/recipes?${queryString}`;

  console.log('📤 Запрос рецептов:', `${STRAPI_API_URL}${url}`);

  try {
    const response = await api.get<PaginatedResponse>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('🚨 Ошибка API (getRecipes):', error.response?.status, error.response?.data);
    }
    throw error;
  }
};

export const getRecipeById = async (documentId: string): Promise<Recipe> => {
  // Параметры запроса: populate для связанных данных
  const queryParams = {
    populate: ['images', 'ingradients', 'category', 'directions', 'equipments'],
  };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const url = `/recipes/${documentId}?${queryString}`;

  console.log('📤 Запрос рецепта по ID:', `${STRAPI_API_URL}${url}`);

  try {
    const response = await api.get<{ data: Recipe }>(url);

    if (!response.data.data) {
      throw new Error('Рецепт не найден');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error(`🚨 Рецепт с documentId="${documentId}" не найден`);
        throw new Error('Рецепт не найден');
      }
      console.error('🚨 Ошибка API (getRecipeById):', error.response?.status, error.response?.data);
    } else {
      console.error('🚨 Неизвестная ошибка:', error);
    }
    throw error;
  }
};

// ———————————————————————————————
// Избранное
// ———————————————————————————————

export const getFavorites = async (): Promise<Recipe[]> => {
  const queryParams = {
    populate: ['images', 'ingradients', 'category'],
  };
  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const url = `/favorites?${queryString}`;

  try {
    const response = await api.get<{ data: Recipe[] }>(url);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('🚨 Ошибка загрузки избранного:', error.response?.data);
    }
    throw error;
  }
};

export const addFavorite = async (recipeId: number): Promise<void> => {
  try {
    await api.post('/favorites/add', { recipe: recipeId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('🚨 Ошибка добавления в избранное:', error.response?.data);
    }
    throw error;
  }
};

export const removeFavorite = async (recipeId: number): Promise<void> => {
  try {
    await api.post('/favorites/remove', { recipe: recipeId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('🚨 Ошибка удаления из избранного:', error.response?.data);
    }
    throw error;
  }
};

export default api