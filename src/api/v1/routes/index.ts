import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";

const v1Router = Router();

v1Router.use("/categories", categoryRoutes);
v1Router.use("/products", productRoutes);

export default v1Router;