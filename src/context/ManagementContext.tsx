import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

interface ManagementContextType {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string;
    refreshData: () => Promise<void>;

    addProduct: (product: Product) => void;
    updateProductInContext: (product: Product) => void;
    removeProduct: (productId: number) => void;

    addCategory: (category: Category) => void;
    updateCategoryInContext: (category: Category) => void;
    removeCategory: (categoryId: number) => void;
}

const ManagementContext
    = createContext<ManagementContextType | undefined>(undefined);

interface ManagementProviderProps {
    children: ReactNode;
}

export function ManagementProvider({children}: ManagementProviderProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [productData, categoryData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            setProducts(productData);
            setCategories(categoryData);
        } catch {
            setError("Failed to load products or categories.");
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = (product: Product) => {
        setProducts((previous) => [...previous, product]);
    };

    const updateProductInContext = (updatedProduct: Product) => {
        setProducts((previous) =>
            previous.map((product) =>
                product.id === updatedProduct.id
                    ? updatedProduct
                    : product
            )
        );
    };

    const removeProduct = (productId: number) => {
        setProducts((previous) =>
            previous.filter((product) => product.id !== productId)
        );
    };

    const addCategory = (category: Category) => {
        setCategories((previous) => [...previous, category]);
    };

    const updateCategoryInContext = (updatedCategory: Category) => {
        setCategories((previous) =>
            previous.map((category) =>
                category.id === updatedCategory.id
                    ? updatedCategory
                    : category
            )
        );
    };

    const removeCategory = (categoryId: number) => {
        setCategories((previous) =>
            previous.filter((category) => category.id !== categoryId)
        );
    };

    useEffect(() => {
        void refreshData();
    }, [refreshData]);

    return (
        <ManagementContext.Provider
            value={{
                products,
                categories,
                loading,
                error,
                refreshData,
                addProduct,
                updateProductInContext,
                removeProduct,
                addCategory,
                updateCategoryInContext,
                removeCategory
            }}
        >
            {children}
        </ManagementContext.Provider>
    );
}

export function useManagement() {
    const context = useContext(ManagementContext);

    if (!context) {
        throw new Error(
            "useManagement must be used within a ManagementProvider"
        );
    }

    return context;
}
