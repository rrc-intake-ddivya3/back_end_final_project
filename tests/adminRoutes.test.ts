import express from "express";
import { Request, Response, NextFunction } from "express";
import request from "supertest";
import adminRoutes from "../src/api/v1/routes/adminRoutes";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((_req: Request, _res: Response, next: NextFunction) => next()),
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(
        () =>
            (req: Request, res: Response, next: NextFunction) => {
                if (req.headers["x-deny"] === "true") {
                    res.status(403).json({ error: "Forbidden" });
                    return;
                }
                next();
            },
    ),
);

jest.mock("../src/api/v1/controllers/adminController", () => ({
    setUserRoleHandler: jest.fn((req, res) => {
        res.status(200).json({
            status: "success",
            data: { uid: req.params.uid, role: req.body.role },
            message: "User role updated successfully",
        });
    }),
}));

import authenticate from "../src/api/v1/middleware/authenticate";

describe("Admin Routes", () => {
    const mockedAuthenticate = authenticate as unknown as jest.Mock;

    beforeEach(() => {
        mockedAuthenticate.mockImplementation(
            (_req: Request, _res: Response, next: NextFunction) => next(),
        );
    });

    it("should update user role for valid request", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/admin", adminRoutes);

        const response = await request(app)
            .post("/api/v1/admin/users/user-123/role")
            .send({ role: "admin" });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toEqual({ uid: "user-123", role: "admin" });
    });

    it("should return 400 when role value is invalid", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/admin", adminRoutes);

        const response = await request(app)
            .post("/api/v1/admin/users/user-123/role")
            .send({ role: "manager" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should return 401 when user is not authenticated", async () => {
        mockedAuthenticate.mockImplementation((_req, res, _next) => {
            res.status(401).json({ error: "Unauthorized" });
        });

        const app = express();
        app.use(express.json());
        app.use("/api/v1/admin", adminRoutes);

        const response = await request(app)
            .post("/api/v1/admin/users/user-123/role")
            .send({ role: "staff" });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 403 when authenticated user is not authorized", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/admin", adminRoutes);

        const response = await request(app)
            .post("/api/v1/admin/users/user-123/role")
            .set("x-deny", "true")
            .send({ role: "customer" });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Forbidden");
    });
});
