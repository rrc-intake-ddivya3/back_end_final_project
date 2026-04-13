import Joi from "joi";

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
