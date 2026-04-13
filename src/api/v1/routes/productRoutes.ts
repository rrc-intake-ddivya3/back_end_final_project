import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

router.post("/", productController.createProductHandler);
router.get("/", productController.getAllProductsHandler);
router.get("/:id", productController.getProductByIdHandler);
router.put("/:id", productController.updateProductHandler);
router.delete("/:id", productController.deleteProductHandler);

export default router;
