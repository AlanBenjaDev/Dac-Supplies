"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = void 0;
const payment_service_1 = require("../services/payment.service");
const checkoutController = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const userId = Number(req.user.id);
        const userEmail = String(req.user.email);
        const { product_id, quantity, envio, color } = req.body;
        if (!product_id || !quantity || !envio) {
            return res.status(400).json({ message: "Datos incompletos" });
        }
        console.log("envio es", envio);
        console.log("color es", color);
        const result = await (0, payment_service_1.checkoutService)({
            userId,
            product_id,
            quantity,
            envio,
            color,
            userEmail
        });
        res.status(200).json({
            preferenceId: result.preferenceId
        });
    }
    catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({ message: "Error en el checkout" });
    }
};
exports.checkoutController = checkoutController;
