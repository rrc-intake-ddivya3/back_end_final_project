import { Router } from "express";
import * as productController from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { productSchemas } from "../Validations/productSchemas";

const router = Router();

router.post(
    "/",
    validateRequest(productSchemas.create),
    productController.createProductHandler,
);
router.get("/", productController.getAllProductsHandler);
router.get(
    "/:id",
    validateRequest(productSchemas.getById),
    productController.getProductByIdHandler,
);
router.put(
    "/:id",
    validateRequest(productSchemas.update),
    productController.updateProductHandler,
);
router.delete(
    "/:id",
    validateRequest(productSchemas.delete),
    productController.deleteProductHandler,
);

export default router;
