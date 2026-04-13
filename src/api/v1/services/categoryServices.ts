import type { Category } from "../models/categoryModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION = "categories";

// create a category
export const createCategory = async (categoryData: {
    name: string;
}): Promise<Category> => {
    try {
        const newCategoryData = {
            ...categoryData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await firestoreRepository.allocateSequentialId(COLLECTION);
        await firestoreRepository.createDocumentWithId(
            COLLECTION,
            id,
            newCategoryData,
        );

        return { id, ...newCategoryData } as Category;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create category: ${errorMessage}`);
    }
};

// get every category
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const categories =
            await firestoreRepository.getAllDocuments<Category>(COLLECTION);
        return categories;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve categories: ${errorMessage}`);
    }
};

// get one category by id
export const getCategoryById = async (id: string): Promise<Category> => {
    try {
        const category = await firestoreRepository.getDocById<Category>(
            COLLECTION,
            id,
        );

        if (!category) {
            throw new Error("Category not found");
        }

        return category;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve category: ${errorMessage}`);
    }
};

// update category PUT
export const updateCategory = async (
    id: string,
    categoryData: { name?: string },
): Promise<Category> => {
    try {
        const updateData: Record<string, unknown> = {};

        if (categoryData.name !== undefined) {
            updateData.name = categoryData.name;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("No fields provided to update");
        }

        updateData.updatedAt = new Date();

        await firestoreRepository.updateDocument(COLLECTION, id, updateData);

        const updated = await firestoreRepository.getDocById<Category>(
            COLLECTION,
            id,
        );

        if (!updated) {
            throw new Error("Updated category not found");
        }

        return updated;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update category: ${errorMessage}`);
    }
};

// delete a category
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete category: ${errorMessage}`);
    }
};
