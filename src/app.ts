import express, { Express } from "express";
import v1Routes from "./api/v1/routes/index";
import { corsMiddleware } from "./config/corsConfig";
import errorHandler from "./api/v1/middleware/errorHandler";
import { helmetMiddleware } from "./config/helmetConfig";
import apiRateLimiter from "./api/v1/middleware/rateLimiter";
import setupSwagger from "./config/swagger";

// Initialize Express application
const app: Express = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use("/api/v1", apiRateLimiter);
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.use("/api/v1", v1Routes);

app.use(errorHandler);

setupSwagger(app);  

export default app;