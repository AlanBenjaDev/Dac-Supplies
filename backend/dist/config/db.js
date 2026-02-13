"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = promise_1.default.createPool({
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
});
(async () => {
    try {
        const [tables] = await db.query("SHOW TABLES");
        console.log(" Tablas existentes de mi DB:", tables.map((c) => Object.values(c)[0]));
        console.log(" Conected to database");
    }
    catch (err) {
        console.error("Error conecting at database", err);
        process.exit(1);
    }
})();
exports.default = db;
