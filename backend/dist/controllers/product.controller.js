"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductController = exports.getProductosPorCategoria = exports.getProductsByIdController = exports.getProductsController = exports.createProductController = exports.wss = void 0;
exports.setWebSocketServer = setWebSocketServer;
const product_service_1 = require("../services/product.service");
const category_types_1 = require("../types/category.types");
function setWebSocketServer(wsServer) {
    exports.wss = wsServer;
}
const createProductController = async (req, res) => {
    try {
        const { producto, descripcion, precio, stock, categoria, tipo } = req.body;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: "Usuario no autenticado" });
        if (!producto || !descripcion || !precio || !stock || !categoria)
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        if (!req.file?.path)
            return res.status(400).json({ error: "No se recibió imagen" });
        const product = await (0, product_service_1.createProductService)({
            producto,
            descripcion,
            precio: Number(precio),
            stock: Number(stock),
            categoria,
            imagen: req.file.path,
            tipo
        });
        res.status(201).json({ message: "Producto creado exitosamente", data: product });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createProductController = createProductController;
const getProductsController = async (req, res) => {
    try {
        const products = await (0, product_service_1.getProductsService)();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getProductsController = getProductsController;
const getProductsByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const product = await (0, product_service_1.getProductsByIdService)(id);
        res.status(200).json(product);
    }
    catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getProductsByIdController = getProductsByIdController;
const getProductosPorCategoria = async (req, res) => {
    try {
        const categoriaRaw = req.params.categoriaQuery.toLowerCase().replace("-", "_");
        const categoria = categoriaRaw;
        if (!Object.values(category_types_1.Categorias).includes(categoria)) {
            return res.status(400).json({ error: `Categoría '${categoria}' inválida` });
        }
        const productos = await (0, product_service_1.obtenerProductosPorCategoria)(categoria);
        res.status(200).json(productos);
    }
    catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};
exports.getProductosPorCategoria = getProductosPorCategoria;
const deleteProductController = async (req, res) => {
    try {
        const userId = (Number(req.user?.id));
        const productId = req.params.id;
        await (0, product_service_1.deleteProductService)(Number(productId));
        res.status(200).json({ message: "Producto eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteProductController = deleteProductController;
