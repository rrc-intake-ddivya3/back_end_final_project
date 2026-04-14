import { Request, Response, NextFunction } from "express";
import { getAuth } from "../../../config/firebaseAdmin";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const setUserRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { uid } = req.params;
        const { role } = req.body as { role: "admin" | "staff" | "customer" };

        await getAuth().setCustomUserClaims(uid as string, { role });
        await getAuth().revokeRefreshTokens(uid as string);

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                { uid, role },
                "User role updated successfully. User must sign in again.",
            ),
        );
    } catch (error: unknown) {
        next(error);
    }
};
