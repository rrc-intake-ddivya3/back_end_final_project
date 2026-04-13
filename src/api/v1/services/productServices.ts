import type { Category } from "../models/categoryModel";
import type { Product } from "../models/productModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION = "products";
const CATEGORIES = "categories";

async function categoryExists(categoryId: string): Promise<boolean> {
    const category = await firestoreRepository.getDocById<Category>(
        CATEGORIES,
        categoryId,
    );
    return category !== null;
}

// create a product
export const createProduct = async (productData: {
    name: string;
    price: number;
    quantity: number;
    categoryId: string;
}): Promise<Product> => {
    try {
        const exists = await categoryExists(productData.categoryId);
        if (!exists) {
            throw new Error("Category not found");
        }

        const newProductData = {
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await firestoreRepository.createWithSequentialId(
            COLLECTION,
            newProductData,
        );

        return { id, ...newProductData } as Product;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create product: ${errorMessage}`);
    }
};

// get every product
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const products =
            await firestoreRepository.getAllDocuments<Product>(COLLECTION);
        return products;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve products: ${errorMessage}`);
    }
};

// get one product by id
export const getProductById = async (id: string): Promise<Product> => {
    try {
        const product = await firestoreRepository.getDocById<Product>(
            COLLECTION,
            id,
        );

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve product: ${errorMessage}`);
    }
};

// update product (PUT body: only fields you send are applied)
export const updateProduct = async (
    id: string,
    productData: {
        name?: string;
        price?: number;
        quantity?: number;
        categoryId?: string;
    },
): Promise<Product> => {
    try {
        if (productData.categoryId !== undefined) {
            const exists = await categoryExists(productData.categoryId);
            if (!exists) {
                throw new Error("Category not found");
            }
        }

        const updateData: Record<string, unknown> = {};

        if (productData.name !== undefined) {
            updateData.name = productData.name;
        }
        if (productData.price !== undefined) {
            updateData.price = productData.price;
        }
        if (productData.quantity !== undefined) {
            updateData.quantity = productData.quantity;
        }
        if (productData.categoryId !== undefined) {
            updateData.categoryId = productData.categoryId;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("No fields provided to update");
        }

        updateData.updatedAt = new Date();

        await firestoreRepository.updateDocument(COLLECTION, id, updateData);

        const updated = await firestoreRepository.getDocById<Product>(
            COLLECTION,
            id,
        );

        if (!updated) {
            throw new Error("Updated product not found");
        }

        return updated;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update product: ${errorMessage}`);
    }
};

// delete a product
export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete product: ${errorMessage}`);
    }
};
