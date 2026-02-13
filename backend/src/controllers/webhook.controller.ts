import { Request, Response } from "express";
import axios from "axios";

import { pedidosRepo } from "../repositories/pedidos";
import { productosRepo } from "../repositories/products";

interface MercadoPagoPayment {
  status: string;
  external_reference: string;
}

export const mercadopagoWebhook = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    if (type !== "payment" || !data?.id) {
      return res.sendStatus(200);
    }

    const paymentId = data.id;

    // Evitar reprocesar el mismo pago
    const pedidoExistente = await pedidosRepo.findByPaymentId(paymentId);
    if (pedidoExistente) {
      return res.sendStatus(200);
    }

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = response.data as MercadoPagoPayment;

    const pedidoId = Number(payment.external_reference);
    if (!pedidoId) return res.sendStatus(200);

    const pedido = await pedidosRepo.findById(pedidoId);
    if (!pedido || pedido.estado === "pagado") {
      return res.sendStatus(200);
    }

    if (payment.status === "approved") {
      await pedidosRepo.update(pedidoId, {
        estado: "pagado",
        payment_id: paymentId,
        fecha_pago: new Date(),
      });

      await productosRepo.decrementStock(
        pedido.producto_id,
        pedido.cantidad
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook MercadoPago error:", error);
    return res.sendStatus(200);
  }
};
