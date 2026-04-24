import { Router } from "express";
import * as productController from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { productSchemas } from "../Validations/productSchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const productRouter = Router();

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a product
 *     description: Creates a new product. Only admins are allowed.
 *     tags:
 *       - Products
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
 *         description: Product created
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
productRouter.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(productSchemas.create),
    productController.createProductHandler,
);
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: List all products
 *     description: Returns all products.
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: Products retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
productRouter.get(
    "/",
    productController.getAllProductsHandler,
);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product document ID
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *       '400':
 *         description: Invalid ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
productRouter.get(
    "/:id",
    validateRequest(productSchemas.getById),
    productController.getProductByIdHandler,
);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product. Admin and staff are allowed.
 *     tags:
 *       - Products
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
 *         description: Product updated successfully
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
productRouter.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(productSchemas.update),
    productController.updateProductHandler,
);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID. Admin, staff, and customers are allowed.
 *     tags:
 *       - Products
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
 *         description: Product deleted successfully
 *       '400':
 *         description: Invalid ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
productRouter.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff", "customer"] }),
    validateRequest(productSchemas.delete),
    productController.deleteProductHandler,
);

export default productRouter;
