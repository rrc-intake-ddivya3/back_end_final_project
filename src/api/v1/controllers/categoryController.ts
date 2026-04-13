import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryServices";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// POST /categories
export const createCategoryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name } = req.body;
        const categoryData = { name };

        const newCategory = await categoryService.createCategory(categoryData);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ newCategory }, "Category created successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// GET /categories
export const getAllCategoriesHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const categories = await categoryService.getAllCategories();

        res.status(HTTP_STATUS.OK).json(
            successResponse({ categories }, "Categories retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// GET /categories/:id
export const getCategoryByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        const category = await categoryService.getCategoryById(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ category }, "Category retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// PATCH /categories/:id
export const updateCategoryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updateData = { name };

        const updatedCategory = await categoryService.updateCategory(
            id as string,
            updateData,
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                { updatedCategory },
                "Category updated successfully",
            ),
        );
    } catch (error: unknown) {
        next(error);
    }
};

// DELETE /categories/:id
export const deleteCategoryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        await categoryService.deleteCategory(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Category deleted successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};
