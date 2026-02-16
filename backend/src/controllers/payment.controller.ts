import { Request, Response } from "express";
import { createPreferenceService, checkoutService } from "../services/payment.service";
import { env } from "process";



export const checkoutController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
  return res.status(401).json({ message: "Usuario no autenticado" });
}

const userId = Number(req.user.id);

const userEmail = String(req.user.email)



const { product_id, quantity, envio } = req.body;

if (!product_id || !quantity || !envio) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    console.log("envio es", envio)
     const result = await checkoutService({
      userId,

      product_id,
      quantity,
      envio,
      userEmail
    });

    res.status(200).json({
      preferenceId: result.preferenceId
    });

  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ message: "Error en el checkout" });
  }
};
