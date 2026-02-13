import db from "../config/db";

export const pedidosRepo = {

  create: async ({ usuario_id, total, estado }: any) => {
    const [result]: any = await db.query(
      `INSERT INTO pedidos (usuario_id, total, estado)
       VALUES (?, ?, ?)`,
      [usuario_id, total, estado]
    );

    return {
      id: result.insertId,
      usuario_id,
      total,
      estado
    };
  },

  update: async (pedidoId: number, data: any) => {
    const fields = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(", ");

    await db.query(
      `UPDATE pedidos SET ${fields} WHERE id = ?`,
      [...Object.values(data), pedidoId]
    );
  },

  findById: async (id: number) => {
    const [rows]: any = await db.query(
      `SELECT * FROM pedidos WHERE id = ?`,
      [id]
    );

    return rows[0];
  },
  findByPaymentId: async (paymentId: string) => {
  const [rows]: any = await db.query(
    `SELECT * FROM pedidos WHERE payment_id = ?`,
    [paymentId]
  );

  return rows[0];
}

};
