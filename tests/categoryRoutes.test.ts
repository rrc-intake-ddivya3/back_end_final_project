import express from "express";
import { Request, Response, NextFunction } from "express";
import request from "supertest";
import categoryRoutes from "../src/api/v1/routes/categoryRoutes";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((_req: Request, _res: Response, next: NextFunction) => next()),
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(
        () =>
            (_req: Request, _res: Response, next: NextFunction) =>
                next(),
    ),
);

jest.mock("../src/api/v1/controllers/categoryController", () => ({
    createCategoryHandler: jest.fn((req, res) => {
        res.status(200).json({
            status: "success",
            data: {
                newCategory: {
                    id: "cat-1",
                    name: req.body.name,
                },
            },
            message: "Category created successfully",
        });
    }),
    getAllCategoriesHandler: jest.fn((_req, res) => {
        res.status(200).json({
            status: "success",
            data: { categories: [] },
            message: "Categories retrieved successfully",
        });
    }),
    getCategoryByIdHandler: jest.fn((req, res) => {
        res.status(200).json({
            status: "success",
            data: {
                category: {
                    id: req.params.id,
                    name: "Beverages",
                },
            },
            message: "Category retrieved successfully",
        });
    }),
    updateCategoryHandler: jest.fn((req, res) => {
        res.status(200).json({
            status: "success",
            data: {
                updatedCategory: {
                    id: req.params.id,
                    name: req.body.name,
                },
            },
            message: "Category updated successfully",
        });
    }),
    deleteCategoryHandler: jest.fn((_req, res) => {
        res.status(200).json({
            status: "success",
            data: {},
            message: "Category deleted successfully",
        });
    }),
}));

describe("Category Routes", () => {
    it("should create category for valid request body", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/categories", categoryRoutes);

        const response = await request(app)
            .post("/api/v1/categories")
            .send({ name: "Beverages" });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.newCategory.name).toBe("Beverages");
    });

    it("should return category by id", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/categories", categoryRoutes);

        const response = await request(app).get("/api/v1/categories/cat-123");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.category.id).toBe("cat-123");
    });

    it("should return 400 when required category name is missing", async () => {
        const app = express();
        app.use(express.json());
        app.use("/api/v1/categories", categoryRoutes);

        const response = await request(app).post("/api/v1/categories").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
