"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidosDetalleRepo = void 0;
// repositories/pedidoDetalle.ts
const db_1 = __importDefault(require("../config/db"));
exports.pedidosDetalleRepo = {
    create: async ({ pedido_id, producto_id, cantidad, precio_unitario, opciones_texto }) => {
        // Sinceramente: Si no mandamos 'opciones_texto', el dueño no va a saber qué sabor armar.
        const [result] = await db_1.default.query(`INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, opciones_texto)
       VALUES (?, ?, ?, ?, ?)`, [pedido_id, producto_id, cantidad, precio_unitario, opciones_texto || null]);
        return {
            id: result.insertId,
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
            opciones_texto
        };
    },
    findByPedidoId: async (pedido_id) => {
        // Agregamos pd.opciones_texto al SELECT para que el frontend del Admin lo vea
        const [rows] = await db_1.default.query(`SELECT pd.*, p.producto, p.img_url 
       FROM pedido_detalle pd
       JOIN productos p ON p.id = pd.producto_id
       WHERE pd.pedido_id = ?`, [pedido_id]);
        return rows;
    },
};
