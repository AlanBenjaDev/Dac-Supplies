"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = exports.createPreferenceForCart = void 0;
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
const createPreferenceForCart = async ({ pedidoId, items }) => {
    const preference = new mercadopago_1.Preference(mp_1.mpClient);
    const mpItems = items.map(item => ({
        id: String(item.producto.id),
        title: item.producto.producto,
        unit_price: Number(item.producto.precio),
        quantity: Number(item.quantity),
        currency_id: "ARS"
    }));
    const response = await preference.create({
        body: {
            items: mpItems,
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
exports.createPreferenceForCart = createPreferenceForCart;
const checkoutService = async ({ userId, envio, items }) => {
    if (!items || items.length === 0) {
        throw new Error("No hay productos en el carrito");
    }
    let total = 0;
    const itemsParaMP = [];
    const pedido = await pedidos_1.pedidosRepo.create({
        usuario_id: userId,
        total: 0,
        estado: "pendiente"
    });
    await envios_1.enviosRepo.create({
        pedido_id: pedido.id,
        ...envio
    });
    for (const item of items) {
        const producto = await products_1.productosRepo.findById(item.product_id);
        if (!producto) {
            throw new Error(`Producto ${item.product_id} no existe`);
        }
        if (producto.stock < item.quantity) {
            throw new Error(`Stock insuficiente para ${producto.producto}`);
        }
        itemsParaMP.push({
            producto: producto,
            quantity: item.quantity
        });
        total += producto.precio * item.quantity;
        const notas = item.opciones?.info_adicional || null;
        await pedidosDetalles_1.pedidosDetalleRepo.create({
            pedido_id: pedido.id,
            producto_id: producto.id,
            cantidad: item.quantity,
            precio_unitario: producto.precio,
            opciones_texto: notas
        });
    }
    await pedidos_1.pedidosRepo.update(pedido.id, { total });
    const preferenceId = await (0, exports.createPreferenceForCart)({
        pedidoId: pedido.id,
        items: itemsParaMP
    });
    await pedidos_1.pedidosRepo.update(pedido.id, {
        preference_id: preferenceId
    });
    return { preferenceId };
};
exports.checkoutService = checkoutService;
