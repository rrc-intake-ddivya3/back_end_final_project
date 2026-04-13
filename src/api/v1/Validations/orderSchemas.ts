import Joi from "joi";

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
