"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerProductosPorCategoria = exports.getProductsByIdService = exports.getProductsService = exports.createProductService = void 0;
const db_1 = __importDefault(require("../config/db"));
const createProductService = async (product) => {
    const [result] = await db_1.default.query(`INSERT INTO productos 
     (producto, descripcion, precio, stock, categoria, img_url)
     VALUES (?, ?, ?, ?, ?, ?)`, [
        product.producto,
        product.descripcion,
        product.precio,
        product.stock,
        product.categoria,
        product.imagen,
    ]);
    return {
        id: result.insertId,
        producto: product.producto,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        categoria: product.categoria,
        img_url: product.imagen
    };
};
exports.createProductService = createProductService;
const getProductsService = async () => {
    const [rows] = await db_1.default.query("SELECT * FROM productos");
    return rows;
};
exports.getProductsService = getProductsService;
const getProductsByIdService = async (id) => {
    const [rows] = await db_1.default.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) {
        throw new Error("NOT_FOUND");
    }
    return rows[0];
};
exports.getProductsByIdService = getProductsByIdService;
const obtenerProductosPorCategoria = async (categoria) => {
    const query = "SELECT * FROM productos WHERE categoria = ?";
    const [rows] = await db_1.default.query(query, [categoria]);
    return rows;
};
exports.obtenerProductosPorCategoria = obtenerProductosPorCategoria;
