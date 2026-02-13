"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidosRepo = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.pedidosRepo = {
    create: async ({ usuario_id, total, estado }) => {
        const [result] = await db_1.default.query(`INSERT INTO pedidos (usuario_id, total, estado)
       VALUES (?, ?, ?)`, [usuario_id, total, estado]);
        return {
            id: result.insertId,
            usuario_id,
            total,
            estado
        };
    },
    update: async (pedidoId, data) => {
        const fields = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(", ");
        await db_1.default.query(`UPDATE pedidos SET ${fields} WHERE id = ?`, [...Object.values(data), pedidoId]);
    },
    findById: async (id) => {
        const [rows] = await db_1.default.query(`SELECT * FROM pedidos WHERE id = ?`, [id]);
        return rows[0];
    },
    findByPaymentId: async (paymentId) => {
        const [rows] = await db_1.default.query(`SELECT * FROM pedidos WHERE payment_id = ?`, [paymentId]);
        return rows[0];
    }
};
