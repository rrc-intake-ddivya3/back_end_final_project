import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { validateRequest } from "../middleware/validateRequest";
import { orderSchemas } from "../Validations/orderSchemas";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(orderSchemas.create),
    orderController.createOrderHandler,
);
router.get("/", orderController.getAllOrdersHandler);
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "staff"] }),
    validateRequest(orderSchemas.getById),
    orderController.getOrderByIdHandler,
);
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(orderSchemas.update),
    orderController.updateOrderHandler,
);
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(orderSchemas.delete),
    orderController.deleteOrderHandler,
);

export default router;
