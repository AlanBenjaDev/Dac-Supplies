"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadopagoWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
const pedidos_1 = require("../repositories/pedidos");
const products_1 = require("../repositories/products");
const mercadopagoWebhook = async (req, res) => {
    try {
        const { type, data } = req.body;
        if (type !== "payment" || !data?.id) {
            return res.sendStatus(200);
        }
        const paymentId = data.id;
        // Evitar reprocesar el mismo pago
        const pedidoExistente = await pedidos_1.pedidosRepo.findByPaymentId(paymentId);
        if (pedidoExistente) {
            return res.sendStatus(200);
        }
        const response = await axios_1.default.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });
        const payment = response.data;
        const pedidoId = Number(payment.external_reference);
        if (!pedidoId)
            return res.sendStatus(200);
        const pedido = await pedidos_1.pedidosRepo.findById(pedidoId);
        if (!pedido || pedido.estado === "pagado") {
            return res.sendStatus(200);
        }
        if (payment.status === "approved") {
            await pedidos_1.pedidosRepo.update(pedidoId, {
                estado: "pagado",
                payment_id: paymentId,
                fecha_pago: new Date(),
            });
            await products_1.productosRepo.decrementStock(pedido.producto_id, pedido.cantidad);
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.error("Webhook MercadoPago error:", error);
        return res.sendStatus(200);
    }
};
exports.mercadopagoWebhook = mercadopagoWebhook;
