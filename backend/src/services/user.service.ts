import db from "../config/db";
import { ResultSetHeader,RowDataPacket } from "mysql2";


interface UsuarioDB {

  user: string;
  mail: string;
  passwordHash: string;

}

export const registerService = async ({ user, mail, passwordHash }:UsuarioDB) => {
  return db.query<ResultSetHeader>(
    `INSERT INTO usuarios(user, email, password) VALUES (?, ?, ?)`,
    [user, mail, passwordHash]
  );


};

export const loginService = async (email: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT id, user, email, password,role
    FROM usuarios
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0];
};

export const adminService = async() =>{
  const  query = `SELECT id, user,email 
  FROM usuarios`

  const params:any = []

  const [rows] = await db.query<RowDataPacket[]>(query,params)

  return rows;
}