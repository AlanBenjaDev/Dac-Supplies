import db from "../config/db";
import { RowDataPacket } from "mysql2";

interface DashboardRow extends RowDataPacket {
  envio_id: number;
  tipo_envio: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  envio_estado: string;
  fecha_envio: string;
  pedido_id: number;
  producto_nombre: string;
  producto_precio: number;
  total_pedido: number;
  estado_pedido: string;
}

export const dashboardService = async (): Promise<DashboardRow[]> => {
  const [rows] = await db.query(`SELECT
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

  return rows as DashboardRow[];
};
