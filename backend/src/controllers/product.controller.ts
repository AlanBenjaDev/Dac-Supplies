import { Request, Response } from "express";
import multer from "multer";
import { WebSocketServer } from "ws";
import { createProductService, getProductsByIdService, getProductsService, obtenerProductosPorCategoria } from "../services/product.service";
import { Categorias } from "../types/category.types";


export let wss: WebSocketServer | undefined;

export function setWebSocketServer(wsServer: WebSocketServer) {
  wss = wsServer;
}


export const createProductController = async (req: Request, res: Response) => {
  try {
console.log("REQ.BODY:", JSON.stringify(req.body, null, 2));
console.log("REQ.FILE:", req.file ? JSON.stringify(req.file, null, 2) : null);


    const { producto, descripcion, precio, stock, categoria } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });
    if (!producto || !descripcion || !precio || !stock || !categoria) 
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    if (!req.file?.path) return res.status(400).json({ error: "No se recibió imagen" });

    const product = await createProductService({
      producto,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoria,
      imagen: req.file.path,
    });

    res.status(201).json({ message: "Producto creado exitosamente", data: product });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getProductsService();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const getProductsByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const product = await getProductsByIdService(id);
    res.status(200).json(product);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductosPorCategoria = async (req: Request, res: Response) => {
  try {
    const categoriaRaw = req.params.categoriaQuery.toLowerCase().replace("-", "_");
    const categoria = categoriaRaw as Categorias;

    if (!Object.values(Categorias).includes(categoria)) {
      return res.status(400).json({ error: `Categoría '${categoria}' inválida` });
    }

    const productos = await obtenerProductosPorCategoria(categoria);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};
