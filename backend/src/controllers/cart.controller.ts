import { Request,Response } from "express";
import { addCartService, deleteCartService, getCartService } from "../services/cart.service";
import db from "../config/db";


export const addCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.id);
    const MAX_LIMITE = 5; 

    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });
    if (isNaN(productId)) return res.status(400).json({ error: "ID inválido" });

    const [producto]: any = await db.query("SELECT stock FROM productos WHERE id = ?", [productId]);
    const [carrito]: any = await db.query(
      "SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?", 
      [userId, productId]
    );

    const stockDisponible = producto[0]?.stock || 0;
    const cantidadYaEnCarrito = carrito[0]?.cantidad || 0;

    if (cantidadYaEnCarrito + 1 > MAX_LIMITE) {
      return res.status(400).json({ 
        error: "Límite por compra alcanzado",
        mensaje: `Solo podés comprar un máximo de ${MAX_LIMITE} unidades de este producto.` 
      });
    }

    if (cantidadYaEnCarrito + 1 > stockDisponible) {
      return res.status(400).json({ error: "Stock insuficiente en depósito" });
    }

    await addCartService(userId, productId, 1);
    res.status(200).json({ message: "Producto agregado" });

  } catch (error) {
    console.error("ADD CART ERROR:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};



  export const getCartController = async (req: Request, res: Response) => {
    try {
      const userId = (Number(req.user?.id));
      const cartItems = await getCartService(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const deleteCartController = async (req:Request, res:Response) =>{
    try{
        const userId = (Number(req.user?.id));
        const cartId = req.params.id;
        await deleteCartService(userId, Number(cartId));
        res.status(200).json({ message: "Cart Removed succesfully" });
    }
    catch(error){
      console.error("Error deleting from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

