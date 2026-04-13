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
export const productSchemas = {
    // POST /products - Create new product
    create: {
        body: Joi.object({
            name: Joi.string().trim().required().messages({
                "any.required": "Product name is required",
                "string.empty": "Product name cannot be empty",
            }),
            price: Joi.number().required().messages({
                "any.required": "Price is required",
            }),
            quantity: Joi.number().integer().optional(),
            stock: Joi.number().integer().optional(),
            categoryId: Joi.string().required().messages({
                "any.required": "Category ID is required",
                "string.empty": "Category ID cannot be empty",
            }),
        }).or("quantity", "stock"),
    },

    // GET /products/:id - Get single product
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Product ID is required",
                "string.empty": "Product ID cannot be empty",
            }),
        }),
    },

    // PUT /products/:id - Update product
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Product ID is required",
                "string.empty": "Product ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().trim().optional(),
            price: Joi.number().optional(),
            quantity: Joi.number().integer().optional(),
            stock: Joi.number().integer().optional(),
            categoryId: Joi.string().optional(),
        })
            .or("name", "price", "quantity", "stock", "categoryId")
            .messages({
                "object.missing":
                    "At least one field is required: name, price, quantity, stock, or categoryId",
            }),
    },

    // DELETE /products/:id - Delete product
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Product ID is required",
                "string.empty": "Product ID cannot be empty",
            }),
        }),
    },
};
