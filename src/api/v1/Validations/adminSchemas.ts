import Joi from "joi";

export const adminSchemas = {
    setUserRole: {
        params: Joi.object({
            uid: Joi.string().required().messages({
                "any.required": "User UID is required",
                "string.empty": "User UID cannot be empty",
            }),
        }),
        body: Joi.object({
            role: Joi.string().valid("admin", "staff", "customer").required().messages({
                "any.required": "Role is required",
                "any.only": "Role must be one of: admin, staff, customer",
            }),
        }),
    },
};
