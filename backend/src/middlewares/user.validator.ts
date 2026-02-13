import { body } from "express-validator";

export const registerValidator = [
  body("user").notEmpty().withMessage("El usuario es obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres"),
];


export const loginValidator = [
  body("user").notEmpty().withMessage("El usuario es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
