import { Request, Response } from "express";
import {  checkoutService } from "../services/payment.service";
import { env } from "process";




export const checkoutController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id ? Number(req.user.id) : null;

    const {
      items,
      envio,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !envio ) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const result = await checkoutService({
      userId,   
      envio,
      items
    });

    return res.status(200).json({
      preferenceId: result.preferenceId
    });

  } catch (error) {
    console.error("Error en checkout:", error);
    return res.status(500).json({ message: "Error en el checkout" });
  }
};
