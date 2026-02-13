"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const usuariosRouter = (0, express_1.Router)();
usuariosRouter.post('/register', user_controller_1.registerController);
usuariosRouter.post('/login', user_controller_1.loginController);
exports.default = usuariosRouter;
