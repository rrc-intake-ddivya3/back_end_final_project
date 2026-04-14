import { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validateRequest";
import { adminSchemas } from "../Validations/adminSchemas";
import * as adminController from "../controllers/adminController";

const router = Router();

/**
 * @openapi
 * /api/v1/admin/users/{uid}/role:
 *   post:
 *     summary: Set a user's role
 *     description: Admin-only endpoint to set Firebase custom claim role for a user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase Authentication user UID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, staff, customer]
 *     responses:
 *       '200':
 *         description: Role updated successfully
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
    "/users/:uid/role",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(adminSchemas.setUserRole),
    adminController.setUserRoleHandler,
);

export default router;
