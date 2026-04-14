import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { validateRequest } from "../middleware/validateRequest";
import { orderSchemas } from "../Validations/orderSchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create an order
 *     description: Creates a new order record. Only admins are allowed.
 *     tags:
 *       - Orders
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
 *         description: Order created
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
    validateRequest(orderSchemas.create),
    orderController.createOrderHandler,
);
/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: List all orders
 *     description: Returns all orders.
 *     tags:
 *       - Orders
 *     responses:
 *       '200':
 *         description: Orders retrieved successfully
 *       '500':
 *         description: Server error
 */
router.get("/", orderController.getAllOrdersHandler);
/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order document ID
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
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
    validateRequest(orderSchemas.getById),
    orderController.getOrderByIdHandler,
);
/**
 * @openapi
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update an order
 *     description: Updates an existing order. Admin and staff are allowed.
 *     tags:
 *       - Orders
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
 *         description: Order updated successfully
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
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(orderSchemas.update),
    orderController.updateOrderHandler,
);
/**
 * @openapi
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Deletes an order by ID. Admin and staff are allowed.
 *     tags:
 *       - Orders
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
 *         description: Order deleted successfully
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
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(orderSchemas.delete),
    orderController.deleteOrderHandler,
);

export default router;
