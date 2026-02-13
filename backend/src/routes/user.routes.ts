import { Router } from "express";
import { registerController,loginController } from "../controllers/user.controller";
import { registerValidator,loginValidator } from "../middlewares/user.validator";
import { validationControl } from "../middlewares/validation.result";
import { autenticarToken } from "../middlewares/token";

const usuariosRouter = Router();

usuariosRouter.post('/register', registerController);
usuariosRouter.post('/login',  loginController);

export default usuariosRouter