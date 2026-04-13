import { Router } from "express";
import categoryRoutes from "./categoryRoutes";

const v1Router = Router();

v1Router.use("/categories", categoryRoutes);

export default v1Router;