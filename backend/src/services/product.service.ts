import db from "../config/db";
import { ResultSetHeader } from "mysql2";
import { Producto, ProductoRow } from "../types/product.types";
import { Categorias } from "../types/category.types";

export interface CreateProductDTO {
  producto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  tipo: string;

}



export const createProductService = async (
  product: CreateProductDTO
): Promise<Producto> => {

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO productos 
     (producto, descripcion, precio, stock, categoria, img_url, tipo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      product.producto,
      product.descripcion,
      product.precio,
      product.stock,
      product.categoria,
      product.imagen,
      product.tipo
  
    ]
  );

  return {
    id: result.insertId,
    producto: product.producto,
    descripcion: product.descripcion,
    precio: product.precio,
    stock: product.stock,
    categoria: product.categoria,
    img_url: product.imagen,
    tipo: product.tipo

    
  };
};




export const getProductsService = async (): Promise<Producto[]> => {
  const [rows] = await db.query<ProductoRow[]>(
    "SELECT * FROM productos"
  );
  return rows;
};

export const getProductsByIdService = async (
  id: number
): Promise<Producto> => {

  const [rows] = await db.query<ProductoRow[]>(
    "SELECT * FROM productos WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("NOT_FOUND");
  }

  return rows[0];
};

export const obtenerProductosPorCategoria = async (categoria: Categorias) => {
  const query = "SELECT * FROM productos WHERE categoria = ?";
  const [rows] = await db.query(query, [categoria]);
  return rows;
};


export const deleteProductService = async(productId: number) => {
  await db.query(`DELETE FROM productos WHERE id = ? `, [productId ]);
}