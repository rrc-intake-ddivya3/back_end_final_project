export interface Category {
    id: string;
    name: string;
}

export type CategoryCreateInput = Pick<Category, "name">;
export type CategoryUpdateInput = Partial<Pick<Category, "name">>;
