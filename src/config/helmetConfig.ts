import helmet from "helmet";

const isProduction = process.env.NODE_ENV === "production";

export const helmetMiddleware = helmet({
    // Keep API secure while allowing local Swagger UI to render during demos.
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
});
