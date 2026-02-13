"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const db_1 = __importDefault(require("../config/db"));
const dashboardService = async () => {
    const [rows] = await db_1.default.query(`SELECT
    e.id AS envio_id,
    e.tipo_envio,
    e.direccion,
    e.ciudad,
    e.codigo_postal,
    e.tracking_codigo,
    e.estado AS envio_estado,
    e.created_at AS fecha_envio,

    ped.id AS pedido_id,
    ped.total AS total_pedido,
    ped.estado AS estado_pedido,

    pd.producto_id,
    pd.cantidad,
    pd.precio_unitario,
    prod.producto AS nombre_producto

FROM envios e
JOIN pedidos ped ON ped.id = e.pedido_id
JOIN pedido_detalle pd ON pd.pedido_id = ped.id
JOIN productos prod ON prod.id = pd.producto_id
ORDER BY e.created_at DESC;

  `);
    return rows;
};
exports.dashboardService = dashboardService;
