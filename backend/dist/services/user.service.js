"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.loginService = exports.registerService = void 0;
const db_1 = __importDefault(require("../config/db"));
const registerService = async ({ user, mail, passwordHash }) => {
    return db_1.default.query(`INSERT INTO usuarios(user, email, password) VALUES (?, ?, ?)`, [user, mail, passwordHash]);
};
exports.registerService = registerService;
const loginService = async (email) => {
    const [rows] = await db_1.default.query(`
    SELECT id, user, email, password,role
    FROM usuarios
    WHERE email = ?
    LIMIT 1
    `, [email]);
    return rows[0];
};
exports.loginService = loginService;
const adminService = async () => {
    const query = `SELECT id, user,email 
  FROM usuarios`;
    const params = [];
    const [rows] = await db_1.default.query(query, params);
    return rows;
};
exports.adminService = adminService;
