import { Router } from "express";
import * as productController from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { productSchemas } from "../Validations/productSchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(productSchemas.create),
    productController.createProductHandler,
);
router.get("/", productController.getAllProductsHandler);
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(productSchemas.getById),
    productController.getProductByIdHandler,
);
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(productSchemas.update),
    productController.updateProductHandler,
);
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(productSchemas.delete),
    productController.deleteProductHandler,
);

export default router;
