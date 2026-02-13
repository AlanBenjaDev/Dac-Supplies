
import { RowDataPacket } from "mysql2";
import { Categorias } from "./category.types";

export interface Producto  {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  img_url: string;

}

export interface ProductoRow extends Producto, RowDataPacket {}
