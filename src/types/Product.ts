export type Product = {
    id: number;
    name: string;
    price: number;
    categoryId: number | null;
};

export type ProductRequest = {
    name: string;
    price: number;
    categoryId: number;
};