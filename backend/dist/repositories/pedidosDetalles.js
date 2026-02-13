"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidosDetalleRepo = void 0;
// repositories/pedidoDetalle.ts
const db_1 = __importDefault(require("../config/db"));
exports.pedidosDetalleRepo = {
    create: async ({ pedido_id, producto_id, cantidad, precio_unitario }) => {
        const [result] = await db_1.default.query(`INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)`, [pedido_id, producto_id, cantidad, precio_unitario]);
        return {
            id: result.insertId,
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
        };
    },
    findByPedidoId: async (pedido_id) => {
        const [rows] = await db_1.default.query(`SELECT pd.*, p.producto, p.precio 
       FROM pedido_detalle pd
       JOIN productos p ON p.id = pd.producto_id
       WHERE pd.pedido_id = ?`, [pedido_id]);
        return rows;
    },
};
