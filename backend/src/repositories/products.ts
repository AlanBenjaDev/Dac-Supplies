import db from "../config/db";

export const productosRepo = {
  findById: async (id: number) => {
    const [rows]: any = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );

    return rows[0];
  },

  decrementStock: async (productId: number, quantity: number) => {
    const [result]: any = await db.query(
      `UPDATE productos 
       SET stock = stock - ?
       WHERE id = ? AND stock >= ?`,
      [quantity, productId, quantity]
    );

    return result.affectedRows > 0;
  }
};
