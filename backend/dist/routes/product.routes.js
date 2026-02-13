"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller");
const express_1 = require("express");
const token_1 = require("../middlewares/token");
const roles_1 = require("../middlewares/roles");
const upload_1 = __importDefault(require("../middlewares/upload"));
const productsRouter = (0, express_1.Router)();
productsRouter.post("/create/product", upload_1.default.single("imagen"), token_1.autenticarToken, (0, roles_1.authorizeRoles)(roles_1.RoleEstatus.admin), product_controller_1.createProductController);
productsRouter.get("/products", product_controller_1.getProductsController);
productsRouter.get("/products/:id", product_controller_1.getProductsByIdController);
productsRouter.get("/:categoriaQuery", product_controller_1.getProductosPorCategoria);
exports.default = productsRouter;
