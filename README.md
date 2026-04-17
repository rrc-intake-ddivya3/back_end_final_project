## Store Inventory Management API - Final Assignment

This project is a backend API built with Express + TypeScript + Firebase Admin.
It manages categories, products, and orders, and includes role-based authorization.

## Working MVP

The MVP is functional and runs without errors for the core backend flow.
I can start the server, call API endpoints, and get structured JSON responses.
Main modules are connected: routes -> validation -> controllers -> services -> repository.
Security middleware is in place using Helmet, CORS, and auth/authorization checks.
Swagger/OpenAPI documentation is generated and available in `openapi.json` and `docs/index.html`.

## Current Progress

I have completed full CRUD routes for categories, products, and orders.
Role-based access is enforced using `authenticate` and `isAuthorized` middleware.
Validation is handled with Joi through a reusable `validateRequest` middleware.

## New Component Highlights
The new components i use is the rateLimiter that limits the number of request from the save server
to handle the traffic.

## Working Tests

Current automated tests are passing:
- Health check endpoint test
- Validation middleware tests

## Git Workflow Adherence

I followed a branch-based workflow using `development` and `master`.
Changes were committed in logical steps with descriptive commit messages.
