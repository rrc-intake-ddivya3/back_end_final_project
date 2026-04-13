import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";

const v1Router = Router();

v1Router.use("/categories", categoryRoutes);
v1Router.use("/products", productRoutes);
v1Router.use("/orders", orderRoutes);

export default v1Router;