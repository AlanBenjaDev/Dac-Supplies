"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = void 0;
const payment_service_1 = require("../services/payment.service");
const checkoutController = async (req, res) => {
    try {
        const userId = req.user?.id ? Number(req.user.id) : null;
        const { items, envio, } = req.body;
        if (!items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !envio) {
            return res.status(400).json({ message: "Datos incompletos" });
        }
        const result = await (0, payment_service_1.checkoutService)({
            userId,
            envio,
            items
        });
        return res.status(200).json({
            preferenceId: result.preferenceId
        });
    }
    catch (error) {
        console.error("Error en checkout:", error);
        return res.status(500).json({ message: "Error en el checkout" });
    }
};
exports.checkoutController = checkoutController;
