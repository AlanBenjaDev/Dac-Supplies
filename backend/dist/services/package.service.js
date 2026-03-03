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
      -- DATOS DEL PEDIDO
      p.id AS pedido_id,
      p.total AS total_pedido,
      p.estado AS estado_pago,
      p.created_at AS fecha,

      -- DATOS del ENVÍO / CLIENTE
      e.nombre AS cliente,
      e.apellido,
      e.email,
      e.documento,
      e.telefono,
      e.provincia,
      e.ciudad,
      e.direccion,
      e.codigo_postal,
      e.tipo_envio,
      e.estado AS envio_estado,

      -- DATOS DEL PRODUCTO Y PERSONALIZACIÓN
      pd.producto_id,
      prod.producto AS articulo,
      pd.cantidad,
      pd.precio_unitario,
      pd.opciones_texto AS personalizacion,
      (pd.cantidad * pd.precio_unitario) AS subtotal_producto

    FROM pedidos p
    JOIN envios e ON p.id = e.pedido_id
    JOIN pedido_detalle pd ON p.id = pd.pedido_id
    JOIN productos prod ON pd.producto_id = prod.id
    ORDER BY p.created_at DESC;
  `);
    const formatted = {};
    for (const row of rows) {
        // Si el pedido no existe en nuestro objeto, lo creamos
        if (!formatted[row.pedido_id]) {
            formatted[row.pedido_id] = {
                pedido_id: row.pedido_id,
                total_pedido: row.total_pedido,
                estado_pago: row.estado_pago, // Cambiado para matchear el Frontend
                fecha_envio: row.fecha,
                envio: {
                    nombre: row.cliente, // La query ahora lo llama 'cliente'
                    apellido: row.apellido,
                    documento: row.documento,
                    telefono: row.telefono,
                    email: row.email,
                    provincia: row.provincia,
                    ciudad: row.ciudad,
                    direccion: row.direccion,
                    codigo_postal: row.codigo_postal,
                    tipo_envio: row.tipo_envio,
                    envio_estado: row.envio_estado
                },
                productos: [],
            };
        }
        // Agregamos el producto al array de productos del pedido
        formatted[row.pedido_id].productos.push({
            nombre_producto: row.articulo, // 'articulo' en SQL -> 'nombre_producto' en Frontend
            cantidad: row.cantidad,
            precio_unitario: row.precio_unitario,
            subtotal: row.subtotal_producto,
            personalizacion: row.personalizacion // La nota de texto del cliente
        });
    }
    return Object.values(formatted);
};
exports.dashboardService = dashboardService;
