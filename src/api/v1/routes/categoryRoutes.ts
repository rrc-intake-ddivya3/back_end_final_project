import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { validateRequest } from "../middleware/validateRequest";
import { categorySchemas } from "../Validations/categorySchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.create),
    categoryController.createCategoryHandler,
);
router.get("/", categoryController.getAllCategoriesHandler);
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(categorySchemas.getById),
    categoryController.getCategoryByIdHandler,
);
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.update),
    categoryController.updateCategoryHandler,
);
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(categorySchemas.delete),
    categoryController.deleteCategoryHandler,
);

export default router;
