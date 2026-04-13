import express, { Express } from "express";
import { corsMiddleware } from "./config/corsConfig";
import setupSwagger from "./docs/swagger";

// Initialize Express application
const app: Express = express();

app.use(corsMiddleware);
app.use(express.json());

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Service health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 */
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

setupSwagger(app);

export default app;