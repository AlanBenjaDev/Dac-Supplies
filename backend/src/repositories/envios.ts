import db from "../config/db";


export const enviosRepo = {

  create: async ({
    pedido_id,
    tipo_envio,
    nombre,
    apellido,
    provincia,
    documento,
    ciudad,
    direccion,
    codigo_postal,
    telefono
  }: any) => {

    await db.query(
      `INSERT INTO envios
       (pedido_id, tipo_envio, ciudad, direccion, codigo_postal,nombre,apellido,documento,provincia,telefono)
       VALUES (?, ?, ?, ?, ?,?,?,?,?,?)`,
      [
        pedido_id,
        tipo_envio,
        ciudad,
        direccion,
        codigo_postal,
        nombre,
        apellido,
        documento,
        provincia,
        telefono
      ]
    );
  }
};
