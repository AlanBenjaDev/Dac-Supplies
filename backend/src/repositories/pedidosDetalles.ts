// repositories/pedidoDetalle.ts
import db from "../config/db";

export const pedidosDetalleRepo = {
  create: async ({ pedido_id, producto_id, cantidad, precio_unitario }: any) => {
    const [result]: any = await db.query(
      `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)`,
      [pedido_id, producto_id, cantidad, precio_unitario]
    );

    return {
      id: result.insertId,
      pedido_id,
      producto_id,
      cantidad,
      precio_unitario,
    };
  },

  findByPedidoId: async (pedido_id: number) => {
    const [rows]: any = await db.query(
      `SELECT pd.*, p.producto, p.precio 
       FROM pedido_detalle pd
       JOIN productos p ON p.id = pd.producto_id
       WHERE pd.pedido_id = ?`,
      [pedido_id]
    );
    return rows;
  },
};
