import { Request, Response, NextFunction } from "express";
import * as productService from "../services/productServices";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// POST /products
export const createProductHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, price, quantity, stock, categoryId } = req.body;
        const productData = {
            name,
            price,
            quantity: quantity ?? stock,
            categoryId,
        };

        const newProduct = await productService.createProduct(productData);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ newProduct }, "Product created successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// GET /products
export const getAllProductsHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const products = await productService.getAllProducts();

        res.status(HTTP_STATUS.OK).json(
            successResponse({ products }, "Products retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// GET /products/:id
export const getProductByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ product }, "Product retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// PUT /products/:id
export const updateProductHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, quantity, stock, categoryId } = req.body ?? {};
        const updateData = {
            name,
            price,
            quantity: quantity ?? stock,
            categoryId,
        };

        const updatedProduct = await productService.updateProduct(
            id as string,
            updateData,
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                { updatedProduct },
                "Product updated successfully",
            ),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// DELETE /products/:id
export const deleteProductHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        await productService.deleteProduct(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Product deleted successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};
