import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: Firestore document ID
 *           example: "Hl15oFbfej2oTXIayCdH"
 *         userId:
 *           type: string
 *           description: Owner user identifier
 *           example: "user-42"
 *         content:
 *           type: string
 *           description: Post body text
 *           example: "Hello from the API"
 *         createdAt:
 *           description: Creation time (ISO string or Firestore timestamp object)
 *         updatedAt:
 *           description: Last update time (ISO string or Firestore timestamp object)
 *     PostCreateBody:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           example: "user-42"
 *         content:
 *           type: string
 *           example: "My first post"
 *     PostUpdateBody:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: New content (optional; at least one field should be provided per validation rules)
 *           example: "Updated text"
 *     ApiSuccess:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Post created successfully
 *         data:
 *           type: object
 *           description: Payload wrapper (e.g. newPost, posts, post, updatedPost)
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation error: Body: Content is required"
 */

// operation schemas organized by request part
export const orderSchemas = {
    // POST /orders - Create new order
    create: {
        body: Joi.object({
            productId: Joi.string().required().messages({
                "any.required": "Product ID is required",
                "string.empty": "Product ID cannot be empty",
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                "any.required": "Quantity is required",
                "number.min": "Quantity must be at least 1",
            }),
        }),
    },

    // GET /orders/:id - Get single order
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Order ID is required",
                "string.empty": "Order ID cannot be empty",
            }),
        }),
    },

    // PUT /orders/:id - Update order
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Order ID is required",
                "string.empty": "Order ID cannot be empty",
            }),
        }),
        body: Joi.object({
            productId: Joi.string().optional(),
            quantity: Joi.number().integer().min(1).optional().messages({
                "number.min": "Quantity must be at least 1",
            }),
        })
            .or("productId", "quantity")
            .messages({
                "object.missing":
                    "At least one field is required: productId or quantity",
            }),
    },

    // DELETE /orders/:id - Delete order
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Order ID is required",
                "string.empty": "Order ID cannot be empty",
            }),
        }),
    },
};
