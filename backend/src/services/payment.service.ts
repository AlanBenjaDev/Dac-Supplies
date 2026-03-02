import { Preference } from "mercadopago";
import { mpClient } from "../config/mp";
import { productosRepo } from "../repositories/products";
import { pedidosRepo } from "../repositories/pedidos";
import { enviosRepo } from "../repositories/envios";
import { pedidosDetalleRepo } from "../repositories/pedidosDetalles";
import dotenv from "dotenv";
import db from "../config/db";
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

interface CreatePreferenceCartDTO {
  pedidoId: number;
  items: {
    producto: any;
    quantity: number;
  }[];
}

interface CheckoutDTO {
  userId: number | null;
  envio: any; // Mantenemos la flexibilidad de los datos de envío
  items: {
    product_id: number;
    quantity: number;
    opciones?: {
      info_adicional?: string;
    };
  }[];
}

export const createPreferenceForCart = async ({
  pedidoId,
  items
}: CreatePreferenceCartDTO): Promise<string> => {
  const preference = new Preference(mpClient);

  const mpItems = items.map(item => ({
    id: String(item.producto.id),
    title: item.producto.producto,
    unit_price: Number(item.producto.precio),
    quantity: Number(item.quantity),
    currency_id: "ARS"
  }));

  const response = await preference.create({
    body: {
      items: mpItems,
      external_reference: String(pedidoId),
      back_urls: {
        success: `${FRONTEND_URL}/success`,
        failure: `${FRONTEND_URL}/failure`,
        pending: `${FRONTEND_URL}/pending`
      },
      notification_url: `${BACKEND_URL}/api/webhook/mercadopago`
    }
  });

  return response.id!;
};

export const checkoutService = async ({
  userId,
  envio,
  items
}: CheckoutDTO) => {
  if (!items || items.length === 0) {
    throw new Error("No hay productos en el carrito");
  }

  let total = 0;
  const itemsParaMP: any[] = []; 

  const pedido = await pedidosRepo.create({
    usuario_id: userId,
    total: 0,
    estado: "pendiente"
  });

  await enviosRepo.create({
    pedido_id: pedido.id,
    ...envio
  });

  for (const item of items) {
    const producto = await productosRepo.findById(item.product_id);

    if (!producto) {
      throw new Error(`Producto ${item.product_id} no existe`);
    }

    if (producto.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${producto.producto}`);
    }

    itemsParaMP.push({
      producto: producto,
      quantity: item.quantity
    });

    total += producto.precio * item.quantity;


    const notas = item.opciones?.info_adicional || null;

  
    await pedidosDetalleRepo.create({
      pedido_id: pedido.id,
      producto_id: producto.id,
      cantidad: item.quantity,
      precio_unitario: producto.precio,
      opciones_texto: notas
    });
  }

  await pedidosRepo.update(pedido.id, { total });

  const preferenceId = await createPreferenceForCart({
    pedidoId: pedido.id,
    items: itemsParaMP
  });

  await pedidosRepo.update(pedido.id, {
    preference_id: preferenceId
  });

  return { preferenceId };
};