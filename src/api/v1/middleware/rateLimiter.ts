import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
});
