export interface UploadFile {
    id: number;
    documentId: string;
    name: string;
    url: string;
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
    ingradients: Ingredient[];
    directions: Direction[];
    equipments: Equipment[];
    calories: number;
    category: Category;
    rating: number;
    summary: string;
    vegetarian: boolean;
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


