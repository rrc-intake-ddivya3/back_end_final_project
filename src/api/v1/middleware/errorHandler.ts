import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/httpError";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handling middleware for an Express application.
 * Catches all errors passed to next() and formats them into a consistent response format.
 *
 * This middleware:
 * - Handles all AppError subclasses (AuthenticationError, AuthorizationError, etc.)
 * - Provides consistent error response format using errorResponse()
 * - Logs errors for debugging and monitoring
 * - Handles unexpected errors gracefully
 * - Prevents error details from leaking in production
 *
 * @param err - The error object passed from previous middleware or route handlers
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for Express error middleware signature)
 */
const errorHandler = (
    err: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        console.error("Error: null or undefined error received");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    // Log the error message for debugging
    console.error(`Error: ${err.message}`);

    // Log stack trace for non-production environments
    if (process.env.NODE_ENV !== "production") {
        console.error(`Stack: ${err.stack}`);
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
        return;
    }

    // Plain Error (e.g. Firebase not configured): show message in dev so Postman is useful
    const isProduction = process.env.NODE_ENV === "production";
    const message =
        !isProduction && err instanceof Error
            ? err.message
            : "An unexpected error occurred";
    const code =
        !isProduction && err instanceof Error ? "SERVER_ERROR" : "UNKNOWN_ERROR";

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        errorResponse(message, code),
    );
};

export default errorHandler;