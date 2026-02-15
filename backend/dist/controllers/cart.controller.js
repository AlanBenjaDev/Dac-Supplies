"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartController = exports.getCartController = exports.addCartController = void 0;
const cart_service_1 = require("../services/cart.service");
const db_1 = __importDefault(require("../config/db"));
const addCartController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const productId = Number(req.params.id);
        const MAX_LIMITE = 5;
        if (!userId)
            return res.status(401).json({ error: "Usuario no autenticado" });
        if (isNaN(productId))
            return res.status(400).json({ error: "ID inválido" });
        const [producto] = await db_1.default.query("SELECT stock FROM productos WHERE id = ?", [productId]);
        const [carrito] = await db_1.default.query("SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?", [userId, productId]);
        const stockDisponible = producto[0]?.stock || 0;
        const cantidadYaEnCarrito = carrito[0]?.cantidad || 0;
        if (cantidadYaEnCarrito + 1 > MAX_LIMITE) {
            return res.status(400).json({
                error: "Límite por compra alcanzado",
                mensaje: `Solo podés comprar un máximo de ${MAX_LIMITE} unidades de este producto.`
            });
        }
        if (cantidadYaEnCarrito + 1 > stockDisponible) {
            return res.status(400).json({ error: "Stock insuficiente en depósito" });
        }
        await (0, cart_service_1.addCartService)(userId, productId, 1);
        res.status(200).json({ message: "Producto agregado" });
    }
    catch (error) {
        console.error("ADD CART ERROR:", error);
        res.status(500).json({ error: "Error al agregar al carrito" });
    }
};
exports.addCartController = addCartController;
const getCartController = async (req, res) => {
    try {
        const userId = (Number(req.user?.id));
        const cartItems = await (0, cart_service_1.getCartService)(userId);
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCartController = getCartController;
const deleteCartController = async (req, res) => {
    try {
        const userId = (Number(req.user?.id));
        const cartId = req.params.id;
        await (0, cart_service_1.deleteCartService)(userId, Number(cartId));
        res.status(200).json({ message: "Cart Removed succesfully" });
    }
    catch (error) {
        console.error("Error deleting from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteCartController = deleteCartController;
