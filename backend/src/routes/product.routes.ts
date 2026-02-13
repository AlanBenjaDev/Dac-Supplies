import { createProductController,getProductsController,getProductsByIdController, getProductosPorCategoria } from "../controllers/product.controller";
import { Router } from "express";
import { autenticarToken } from "../middlewares/token";
import { authorizeRoles, RoleEstatus } from "../middlewares/roles";
import upload from "../middlewares/upload";
const productsRouter = Router();
import { Request,Response,NextFunction } from "express";

productsRouter.post(
  "/create/product",
  upload.single("imagen"),

  autenticarToken,
  authorizeRoles(RoleEstatus.admin),
  createProductController
);



productsRouter.get("/products", getProductsController);
productsRouter.get("/products/:id", getProductsByIdController);
productsRouter.get("/:categoriaQuery", getProductosPorCategoria);
export default productsRouter;

