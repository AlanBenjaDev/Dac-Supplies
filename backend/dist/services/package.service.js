"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const db_1 = __importDefault(require("../config/db"));
const dashboardService = async () => {
    const [rows] = await db_1.default.query(`
    SELECT
      e.id AS envio_id,
      e.tipo_envio,
      e.nombre,
      e.apellido,
      e.documento,
      e.telefono,
      e.provincia,
      e.ciudad,
      e.direccion,
      e.email,
      e.codigo_postal,
      e.estado AS envio_estado,
      e.created_at AS fecha_envio,

      ped.id AS pedido_id,
      ped.total AS total_pedido,
      ped.estado AS estado_pedido,

      pd.producto_id,
      prod.producto AS nombre_producto,
      pd.cantidad,
      pd.precio_unitario,
      (pd.cantidad * pd.precio_unitario) AS monto_producto

    FROM envios e
    JOIN pedidos ped ON ped.id = e.pedido_id
    JOIN pedido_detalle pd ON pd.pedido_id = ped.id
    JOIN productos prod ON prod.id = pd.producto_id
    ORDER BY e.created_at DESC;
  `);
    const formatted = {};
    for (const row of rows) {
        if (!formatted[row.pedido_id]) {
            formatted[row.pedido_id] = {
                pedido_id: row.pedido_id,
                total_pedido: row.total_pedido,
                estado_pedido: row.estado_pedido,
                fecha_envio: row.fecha_envio,
                envio: {
                    envio_id: row.envio_id,
                    tipo_envio: row.tipo_envio,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    documento: row.documento,
                    telefono: row.telefono,
                    provincia: row.provincia,
                    ciudad: row.ciudad,
                    direccion: row.direccion,
                    email: row.email,
                    codigo_postal: row.codigo_postal,
                    envio_estado: row.envio_estado,
                },
                productos: [],
            };
        }
        formatted[row.pedido_id].productos.push({
            producto_id: row.producto_id,
            nombre_producto: row.nombre_producto,
            cantidad: row.cantidad,
            precio_unitario: row.precio_unitario,
            subtotal: row.monto_producto,
        });
    }
    return Object.values(formatted);
};
exports.dashboardService = dashboardService;
