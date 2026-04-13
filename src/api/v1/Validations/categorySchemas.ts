import Joi from "joi";

// operation schemas organized by request part
export const categorySchemas = {
    // POST /categories - Create new category
    create: {
        body: Joi.object({
            name: Joi.string().trim().required().messages({
                "any.required": "Category name is required",
                "string.empty": "Category name cannot be empty",
            }),
        }),
    },

    // GET /categories/:id - Get single category
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Category ID is required",
                "string.empty": "Category ID cannot be empty",
            }),
        }),
    },

    // PUT /categories/:id - Update category
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Category ID is required",
                "string.empty": "Category ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().trim().optional().messages({
                "string.empty": "Category name cannot be empty",
            }),
        }).min(1),
    },

    // DELETE /categories/:id - Delete category
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Category ID is required",
                "string.empty": "Category ID cannot be empty",
            }),
        }),
    },
};
