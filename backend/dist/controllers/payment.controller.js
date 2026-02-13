"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = exports.createPreferenceController = void 0;
const payment_service_1 = require("../services/payment.service");
const createPreferenceController = async (req, res) => {
    try {
        const { title, unit_price, quantity } = req.body;
        if (!title || !unit_price || !quantity) {
            return res.status(400).json({ message: "Datos inválidos" });
        }
        if (isNaN(Number(unit_price)) || isNaN(Number(quantity))) {
            throw new Error("unit_price y quantity deben ser números válidos");
        }
        const preferenceId = await (0, payment_service_1.createPreferenceService)({
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity)
        });
        res.json({ preferenceId });
    }
    catch (error) {
        console.error("Detalle MP:", error.apiResponse?.body || error);
        res.status(500).json({
            message: "Error en MP",
            detail: error.apiResponse?.body?.cause || error.message
        });
    }
    ;
};
exports.createPreferenceController = createPreferenceController;
const checkoutController = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const userId = Number(req.user.id);
        console.log("REQ.USER 👉", req.user);
        const { product_id, quantity, envio } = req.body;
        if (!product_id || !quantity || !envio) {
            return res.status(400).json({ message: "Datos incompletos" });
        }
        const result = await (0, payment_service_1.checkoutService)({
            userId,
            product_id,
            quantity,
            envio
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
