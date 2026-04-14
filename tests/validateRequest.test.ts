import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { validateRequest } from "../src/api/v1/middleware/validateRequest";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("validateRequest Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        mockNext = jest.fn();
    });

    it("should pass for valid body input", () => {
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().min(0).max(5000),
            }),
        };
        mockReq.body = { name: "Duncan MacLeod", age: 400 };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should fail for invalid body input", () => {
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().min(0).max(5000),
            }),
        };

        mockReq.body = { name: "Methos", age: 5001 };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Validation error"),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should validate params correctly", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };
        mockReq.params = { id: "post123" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when required params are missing", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };

        mockReq.params = {};
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringMatching(/Validation error:.*Params:.*id.*required/i),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should validate multiple request parts together", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
            body: Joi.object({
                name: Joi.string().required(),
            }),
            query: Joi.object({
                include: Joi.string().valid("details", "summary").optional(),
            }),
        };
        mockReq.params = { id: "post123" };
        mockReq.body = { name: "Updated Post" };
        mockReq.query = { include: "details" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it("should fail when query has invalid enum value", () => {
        const testSchemas = {
            query: Joi.object({
                include: Joi.string().valid("details", "summary").optional(),
            }),
        };
        mockReq.query = { include: "invalid" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Query:"),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
