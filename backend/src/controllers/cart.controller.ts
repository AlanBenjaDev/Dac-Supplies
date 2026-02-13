import { Request,Response } from "express";
import { addCartService, deleteCartService, getCartService } from "../services/cart.service";


export const addCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (isNaN(productId)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    await addCartService(userId, productId, 1);

    res.status(200).json({ message: "Producto agregado al carrito" });

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