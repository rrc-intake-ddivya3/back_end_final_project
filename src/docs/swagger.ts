import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { generateSwaggerSpec } from "../config/swaggerOptions";

const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true }),
    );
};

export default setupSwagger;
