import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { validateRequest } from "../middleware/validateRequest";
import { categorySchemas } from "../Validations/categorySchemas";

const router = Router();

router.post(
    "/",
    validateRequest(categorySchemas.create),
    categoryController.createCategoryHandler,
);
router.get("/", categoryController.getAllCategoriesHandler);
router.get(
    "/:id",
    validateRequest(categorySchemas.getById),
    categoryController.getCategoryByIdHandler,
);
router.put(
    "/:id",
    validateRequest(categorySchemas.update),
    categoryController.updateCategoryHandler,
);
router.delete(
    "/:id",
    validateRequest(categorySchemas.delete),
    categoryController.deleteCategoryHandler,
);

export default router;
