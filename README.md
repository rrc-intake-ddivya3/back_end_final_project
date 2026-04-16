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
I added API docs and included route-level OpenAPI annotations.
The app also includes centralized error handling and HTTP status constants for consistency.

## New Component Highlights

The newest component is the admin role-management flow.
It includes `POST /api/v1/admin/users/:uid/role`, which allows an admin to set a user role (`admin`, `staff`, `customer`).
This was added to support cleaner role management without editing users manually in Firebase Console.

What this component includes:
- `adminRoutes` for secure admin-only access
- `adminSchemas` for validating UID + role input
- `adminController` for setting custom claims and revoking refresh tokens
- `scripts/set-claims.ts` for CLI-based role updates during testing

Main challenge:
- Ensuring only admins can use this endpoint while still returning clear validation/auth errors.
How I handled it:
- Layered middleware in route order: authenticate -> authorize -> validate -> controller.

## Next Steps

1. Increase automated test coverage for key business routes (admin, categories, products, orders).
2. Add more negative-path tests (invalid token, forbidden role, missing params/body).
3. Enable and tune API rate limiter for production usage.
4. Improve deployment readiness (environment docs and production config checks).
5. Add CI workflow so tests run automatically on each push/PR.

## Working Tests

Current automated tests are passing:
- Health check endpoint test
- Validation middleware tests

I also added route-focused tests for:
- Admin role endpoint success + validation + access control paths
- Category route success + validation path

All tests can be run with:
- `npm test`

TypeScript compilation check:
- `npm run build`

## Git Workflow Adherence

I followed a branch-based workflow using `development` and `master`.
Changes were committed in logical steps with descriptive commit messages.
Recent commits show progress in docs, validation, admin role flow, and tests.
I pushed updates to remote and kept the working tree clean before submission.
