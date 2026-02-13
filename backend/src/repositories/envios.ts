import db from "../config/db";


export const enviosRepo = {

  create: async ({
    pedido_id,
    tipo_envio,
    ciudad,
    direccion,
    codigo_postal
  }: any) => {

    await db.query(
      `INSERT INTO envios
       (pedido_id, tipo_envio, ciudad, direccion, codigo_postal)
       VALUES (?, ?, ?, ?, ?)`,
      [
        pedido_id,
        tipo_envio,
        ciudad,
        direccion,
        codigo_postal
      ]
    );
  }
};
