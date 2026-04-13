import { Router } from "express";
import * as categoryController from "../controllers/categoryController";

const router = Router();

router.post("/", categoryController.createCategoryHandler);
router.get("/", categoryController.getAllCategoriesHandler);
router.get("/:id", categoryController.getCategoryByIdHandler);
router.put("/:id", categoryController.updateCategoryHandler);
router.delete("/:id", categoryController.deleteCategoryHandler);

export default router;
