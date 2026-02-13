"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarToken = autenticarToken;
exports.generarToken = generarToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "";
function autenticarToken(req, res, next) {
    console.log("entro a autenticarToken middleware");
    const authHeader = req.header("authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    if (!token) {
        return res.status(401).json({ message: "Token requerido" });
    }
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("→ Error al verificar el token:", err);
            return res.status(403).json({ message: "Token inválido o expirado" });
        }
        req.user = decoded;
        next();
    });
}
function generarToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
}
