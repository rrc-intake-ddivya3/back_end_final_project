import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import adminRoutes from "./adminRoutes";

const v1Router = Router();

// Define the routes for the v1 API
v1Router.use("/categories", categoryRoutes);
v1Router.use("/products", productRoutes);
v1Router.use("/orders", orderRoutes);
v1Router.use("/admin", adminRoutes);

export default v1Router;