"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productosRepo = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.productosRepo = {
    findById: async (id) => {
        const [rows] = await db_1.default.query("SELECT * FROM productos WHERE id = ?", [id]);
        return rows[0];
    },
    decrementStock: async (productId, quantity) => {
        const [result] = await db_1.default.query(`UPDATE productos 
       SET stock = stock - ?
       WHERE id = ? AND stock >= ?`, [quantity, productId, quantity]);
        return result.affectedRows > 0;
    }
};
