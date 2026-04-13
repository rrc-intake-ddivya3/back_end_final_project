import cors, { CorsOptions } from "cors";


export function getCorsOptions(): CorsOptions {
    const raw = process.env.CORS_ORIGIN?.trim();
    if (!raw) {
        return { origin: true };
    }

    const origins = raw
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    if (origins.length === 0) {
        return { origin: true };
    }

    return {
        origin: origins.length === 1 ? origins[0] : origins,
        credentials: true,
    };
}

export const corsMiddleware = cors(getCorsOptions());
