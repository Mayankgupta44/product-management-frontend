
import axiosInstance from "../api/axiosInstance";
import type { Category } from "../types/Category";

export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>("/category");
    return response.data;
};

export const createCategory
    = async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await axiosInstance.post<Category>(
        "/category",
        category
    );

    return response.data;
};

export const updateCategory = async (
    id: number,
    category: Omit<Category, "id">
): Promise<Category> => {
    const response = await axiosInstance.put<Category>(
        `/category/${id}`,
        category
    );

    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/category/${id}`);
};
