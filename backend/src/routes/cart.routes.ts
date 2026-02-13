import { addCartController,getCartController,deleteCartController } from "../controllers/cart.controller";
import { Router } from "express";
import { autenticarToken } from "../middlewares/token";

const cartRouter = Router();
cartRouter.post("/add/:id", autenticarToken, addCartController);
cartRouter.get("/get", autenticarToken, getCartController);
cartRouter.delete("/delete/:id", autenticarToken, deleteCartController);

export default cartRouter;