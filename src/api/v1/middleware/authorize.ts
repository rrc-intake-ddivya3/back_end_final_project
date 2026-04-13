// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/expressTypes";
import { AuthorizationError } from "../errors/httpError";

/**
 * Middleware to check if a user is authorized based on their role or UID.
 *
 * This middleware:
 * - Checks if the user has required roles
 * - Optionally allows users to access their own resources
 * - Throws standardized AuthorizationError for access denied scenarios
 *
 * Usage: `isAuthorized({ hasRole: ["admin"], allowSameUser: true })`
 */
const isAuthorized = (opts: AuthorizationOptions): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role, uid } = res.locals as {
                role?: string;
                uid?: string;
            };
            const { id } = req.params;

            // Allow if the same user is accessing their own data
            if (opts.allowSameUser && id && uid === id) {
                next();
                return;
            }

            // If no role exists on the user, throw Forbidden response
            if (!role) {
                throw new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND",
                );
            }

            // Check if the user's role matches one of the allowed roles
            if (opts.hasRole.includes(role)) {
                next();
                return;
            }

            // If the role is not authorized, throw Forbidden response
            throw new AuthorizationError(
                "Forbidden: Insufficient role",
                "INSUFFICIENT_ROLE",
            );
        } catch (error) {
            // Pass errors to the centralized error handler
            next(error as Error);
        }
    };
};

export default isAuthorized;
