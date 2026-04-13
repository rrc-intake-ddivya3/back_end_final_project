import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderServices";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const createOrderHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { productId, quantity } = req.body;
        const newOrder = await orderService.createOrder({ productId, quantity });

        res.status(HTTP_STATUS.OK).json(
            successResponse({ newOrder }, "Order created successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getAllOrdersHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const orders = await orderService.getAllOrders();

        res.status(HTTP_STATUS.OK).json(
            successResponse({ orders }, "Orders retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getOrderByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        const order = await orderService.getOrderById(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ order }, "Order retrieved successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const updateOrderHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { productId, quantity } = req.body;

        const updatedOrder = await orderService.updateOrder(id as string, {
            productId,
            quantity,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                { updatedOrder },
                "Order updated successfully",
            ),
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteOrderHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        await orderService.deleteOrder(id as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Order deleted successfully"),
        );
    } catch (error: unknown) {
        next(error);
    }
};
