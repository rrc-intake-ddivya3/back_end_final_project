import type { Order } from "../models/orderModel";
import type { Product } from "../models/productModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION = "orders";
const PRODUCTS = "products";

// update create order servive function before creating order, check if product exists and quantity is valid

async function productExists(productId: string): Promise<boolean> {
    const product = await firestoreRepository.getDocById<Product>(
        PRODUCTS,
        productId,
    );
    return product !== null;
}

export const createOrder = async (orderData: {
    productId: string;
    quantity: number;
}): Promise<Order> => {
    try {
        if (orderData.quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        const exists = await productExists(orderData.productId);
        if (!exists) {
            throw new Error("Product not found");
        }

        const newOrderData = {
            ...orderData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await firestoreRepository.createWithSequentialId(
            COLLECTION,
            newOrderData,
        );

        return { id, ...newOrderData } as Order;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create order: ${errorMessage}`);
    }
};

export const getAllOrders = async (): Promise<Order[]> => {
    try {
        return await firestoreRepository.getAllDocuments<Order>(COLLECTION);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve orders: ${errorMessage}`);
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        const order = await firestoreRepository.getDocById<Order>(
            COLLECTION,
            id,
        );

        if (!order) {
            throw new Error("Order not found");
        }

        return order;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve order: ${errorMessage}`);
    }
};

export const updateOrder = async (
    id: string,
    orderData: { productId?: string; quantity?: number },
): Promise<Order> => {
    try {
        if (orderData.quantity !== undefined && orderData.quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        if (orderData.productId !== undefined) {
            const exists = await productExists(orderData.productId);
            if (!exists) {
                throw new Error("Product not found");
            }
        }

        const updateData: Record<string, unknown> = {};

        if (orderData.productId !== undefined) {
            updateData.productId = orderData.productId;
        }
        if (orderData.quantity !== undefined) {
            updateData.quantity = orderData.quantity;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("No fields provided to update");
        }

        updateData.updatedAt = new Date();

        await firestoreRepository.updateDocument(COLLECTION, id, updateData);

        const updated = await firestoreRepository.getDocById<Order>(
            COLLECTION,
            id,
        );

        if (!updated) {
            throw new Error("Updated order not found");
        }

        return updated;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update order: ${errorMessage}`);
    }
};

export const deleteOrder = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete order: ${errorMessage}`);
    }
};
