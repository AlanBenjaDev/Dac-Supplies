"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartService = exports.getCartService = exports.addCartService = void 0;
const db_1 = __importDefault(require("../config/db"));
const addCartService = async (userId, productId, quantity) => {
    await db_1.default.query(`INSERT INTO carrito (usuario_id, producto_id, cantidad)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`, [userId, productId, quantity || 1, quantity || 1]);
};
exports.addCartService = addCartService;
const getCartService = async (userId) => {
    const [rows] = await db_1.default.query(`
    SELECT c.id, p.producto, p.precio, p.img_url, c.cantidad
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    WHERE c.usuario_id = ?`, [userId]);
    return rows;
};
exports.getCartService = getCartService;
const deleteCartService = async (userId, cartId) => {
    await db_1.default.query(`DELETE FROM carrito WHERE id = ? AND usuario_id = ?`, [cartId, userId]);
};
exports.deleteCartService = deleteCartService;
