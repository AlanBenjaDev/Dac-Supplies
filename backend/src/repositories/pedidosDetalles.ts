// repositories/pedidoDetalle.ts
import db from "../config/db";

export const pedidosDetalleRepo = {
  create: async ({ pedido_id, producto_id, cantidad, precio_unitario, opciones_texto }: any) => {
    // Sinceramente: Si no mandamos 'opciones_texto', el dueño no va a saber qué sabor armar.
    const [result]: any = await db.query(
      `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, opciones_texto)
       VALUES (?, ?, ?, ?, ?)`,
      [pedido_id, producto_id, cantidad, precio_unitario, opciones_texto || null]
    );

    return {
      id: result.insertId,
      pedido_id,
      producto_id,
      cantidad,
      precio_unitario,
      opciones_texto
    };
  },

  findByPedidoId: async (pedido_id: number) => {
    // Agregamos pd.opciones_texto al SELECT para que el frontend del Admin lo vea
    const [rows]: any = await db.query(
      `SELECT pd.*, p.producto, p.img_url 
       FROM pedido_detalle pd
       JOIN productos p ON p.id = pd.producto_id
       WHERE pd.pedido_id = ?`,
      [pedido_id]
    );
    return rows;
  },
};