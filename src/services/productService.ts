import axiosInstance from "../api/axiosInstance";
import type { Product, ProductRequest } from "../types/Product";

export const getProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>("/products");
    return response.data;
};

export const createProduct = async (
    product: ProductRequest
): Promise<Product> => {
    const response = await axiosInstance.post<Product>(
        "/products",
        product
    );
    return response.data;
};

export const updateProduct = async (
    id: number,
    product: ProductRequest
): Promise<Product> => {
    const response = await axiosInstance.put<Product>(
        `/products/${id}`,
        product
    );
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
};