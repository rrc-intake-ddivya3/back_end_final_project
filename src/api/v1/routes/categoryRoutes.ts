import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { validateRequest } from "../middleware/validateRequest";
import { categorySchemas } from "../Validations/categorySchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Create a category
 *     description: Creates a new category. Only admins are allowed.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Category created
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.create),
    categoryController.createCategoryHandler,
);
/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     summary: List all categories
 *     description: Returns all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: Categories retrieved successfully
 *       '500':
 *         description: Server error
 */
router.get("/", categoryController.getAllCategoriesHandler);
/**
 * @openapi
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category document ID
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *       '400':
 *         description: Invalid ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(categorySchemas.getById),
    categoryController.getCategoryByIdHandler,
);
/**
 * @openapi
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category
 *     description: Updates an existing category. Only admins are allowed.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.update),
    categoryController.updateCategoryHandler,
);
/**
 * @openapi
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category by ID. Only admins are allowed.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *       '400':
 *         description: Invalid ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.delete),
    categoryController.deleteCategoryHandler,
);

export default router;
