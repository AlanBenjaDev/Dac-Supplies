"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const product_routes_1 = __importDefault(require("../routes/product.routes"));
const cart_routes_1 = __importDefault(require("../routes/cart.routes"));
const cors_1 = __importDefault(require("cors"));
const payment_routes_1 = __importDefault(require("../routes/payment.routes"));
const webhook_controller_1 = require("../controllers/webhook.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const corsOptions = {
    origin: process.env.FRONTEND_URL || "",
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"], // IMPORTANTE
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true })); // <-- ESTA LÍNEA ES VITAL
app.use((req, res, next) => {
    console.log("REQ PATH:", req.path, "METHOD:", req.method);
    next();
});
app.use("/user", user_routes_1.default);
app.use("/products", product_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/payments", payment_routes_1.default);
app.post("/api/webhook/mercadopago", express_1.default.json(), webhook_controller_1.mercadopagoWebhook);
exports.default = app;
