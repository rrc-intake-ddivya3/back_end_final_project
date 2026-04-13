export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    categoryId: string;
}

export type ProductCreateInput = Omit<Product, "id">;
export type ProductUpdateInput = Partial<Omit<Product, "id">>;
