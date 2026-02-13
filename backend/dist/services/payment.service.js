"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = exports.createPreferenceService = void 0;
const mercadopago_1 = require("mercadopago");
const mp_1 = require("../config/mp");
const products_1 = require("../repositories/products");
const pedidos_1 = require("../repositories/pedidos");
const envios_1 = require("../repositories/envios");
const pedidosDetalles_1 = require("../repositories/pedidosDetalles");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const BACKEND_URL = process.env.BACKEND_URL || "";
const createPreferenceService = async ({ title, unit_price, quantity, pedidoId }) => {
    if (!pedidoId) {
        throw new Error("pedidoId es obligatorio");
    }
    const preference = new mercadopago_1.Preference(mp_1.mpClient);
    const response = await preference.create({
        body: {
            items: [
                {
                    id: String(pedidoId),
                    title,
                    unit_price: Number(unit_price),
                    quantity: Number(quantity),
                    currency_id: "ARS"
                }
            ],
            external_reference: String(pedidoId),
            back_urls: {
                success: `${FRONTEND_URL}/success`,
                failure: `${FRONTEND_URL}/failure`,
                pending: `${FRONTEND_URL}/pending`
            },
            notification_url: `${BACKEND_URL}/api/webhook/mercadopago`
        }
    });
    return response.id;
};
exports.createPreferenceService = createPreferenceService;
const checkoutService = async ({ userId, product_id, quantity, envio }) => {
    const producto = await products_1.productosRepo.findById(product_id);
    if (!producto)
        throw new Error("Producto no existe");
    const total = producto.precio * quantity;
    const pedido = await pedidos_1.pedidosRepo.create({
        usuario_id: userId,
        total,
        estado: "pendiente"
    });
    await envios_1.enviosRepo.create({
        pedido_id: pedido.id,
        ciudad: envio.ciudad,
        direccion: envio.direccion,
        codigo_postal: envio.codigo_postal,
        tipo_envio: envio.tipo_envio
    });
    await pedidosDetalles_1.pedidosDetalleRepo.create({
        pedido_id: pedido.id,
        producto_id: product_id,
        cantidad: quantity,
        precio_unitario: producto.precio
    });
    const preferenceId = await (0, exports.createPreferenceService)({
        title: producto.nombre,
        unit_price: producto.precio,
        quantity,
        pedidoId: pedido.id
    });
    await pedidos_1.pedidosRepo.update(pedido.id, {
        preference_id: preferenceId
    });
    return { preferenceId };
};
exports.checkoutService = checkoutService;
