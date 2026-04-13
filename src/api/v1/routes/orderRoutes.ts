import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { validateRequest } from "../middleware/validateRequest";
import { orderSchemas } from "../Validations/orderSchemas";

const router = Router();

router.post(
    "/",
    validateRequest(orderSchemas.create),
    orderController.createOrderHandler,
);
router.get("/", orderController.getAllOrdersHandler);
router.get(
    "/:id",
    validateRequest(orderSchemas.getById),
    orderController.getOrderByIdHandler,
);
router.put(
    "/:id",
    validateRequest(orderSchemas.update),
    orderController.updateOrderHandler,
);
router.delete(
    "/:id",
    validateRequest(orderSchemas.delete),
    orderController.deleteOrderHandler,
);

export default router;
