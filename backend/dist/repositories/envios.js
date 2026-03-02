"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviosRepo = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.enviosRepo = {
    create: async ({ pedido_id, tipo_envio, nombre, apellido, provincia, documento, ciudad, direccion, codigo_postal, telefono, email, }) => {
        await db_1.default.query(`INSERT INTO envios
       (pedido_id, tipo_envio, ciudad, direccion, codigo_postal,nombre,apellido,documento,provincia,telefono,email)
       VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?)`, [
            pedido_id,
            tipo_envio,
            ciudad,
            direccion,
            codigo_postal,
            nombre,
            apellido,
            documento,
            provincia,
            telefono,
            email,
        ]);
    }
};
