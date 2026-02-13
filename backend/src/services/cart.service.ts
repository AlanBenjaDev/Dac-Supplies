import db from "../config/db";
import { RowDataPacket,ResultSetHeader } from "mysql2";

export const addCartService = async(userId: number, productId: number, quantity: number) => {
  await db.query<ResultSetHeader>(
    `INSERT INTO carrito (usuario_id, producto_id, cantidad)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
    [userId, productId, quantity || 1, quantity || 1]
  );

  

}

export const getCartService = async(userId: number) => {
     const [rows] = await db.query(`
    SELECT c.id, p.producto, p.precio, p.img_url, c.cantidad
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    WHERE c.usuario_id = ?`, [userId]);
    
  return rows;
}

export const deleteCartService = async(userId: number,cartId: number) => {
  await db.query(`DELETE FROM carrito WHERE id = ? AND usuario_id = ?`, [cartId, userId]);
}