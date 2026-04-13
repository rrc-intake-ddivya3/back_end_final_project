import { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/httpError";
import { getAuth } from "../../../config/firebaseAdmin";

/**
 * Simple Firebase Auth middleware.
 * - Reads Authorization: Bearer <token>
 * - Verifies the token
 * - Stores uid + role in res.locals
 */
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token =
            authHeader?.startsWith("Bearer ") === true
                ? authHeader.split(" ")[1]
                : undefined;

        if (!token) {
            throw new AuthenticationError(
                "Unauthorized: No token provided",
                "MISSING_AUTHORIZATION",
            );
        }

        const decoded = (await getAuth().verifyIdToken(token)) as DecodedIdToken & {
            role?: string;
        };

        res.locals.uid = decoded.uid;
        res.locals.role = decoded.role;
        next();
    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            next(error);
            return;
        }
        const message = error instanceof Error ? error.message : "Token verification failed";
        next(new AuthenticationError(`Unauthorized: ${message}`, "TOKEN_INVALID"));
    }
};

export default authenticate;
