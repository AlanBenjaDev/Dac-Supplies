"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("user").notEmpty().withMessage("El usuario es obligatorio"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email inválido"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener mínimo 6 caracteres"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("user").notEmpty().withMessage("El usuario es obligatorio"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
