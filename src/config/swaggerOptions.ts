import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || "4000";
const serverBaseUrl =
    process.env.SWAGGER_SERVER_URL?.trim() || `http://localhost:${port}`;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Store Inventory Management API",
            version: "1.0.0",
            description:
                "REST API for products, categories, orders, and inventory management.",
        },
        servers: [
            {
                url: serverBaseUrl,
                description: "Local development",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Firebase ID token",
                },
            },
        },
    },
    apis: [
        "./src/app.ts",
        "./src/api/v1/routes/*.ts",
        "./src/api/v1/validators/*.ts",
    ],
};

export const generateSwaggerSpec = (): object => swaggerJsdoc(swaggerOptions);
