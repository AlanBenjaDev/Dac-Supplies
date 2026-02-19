import { Preference } from "mercadopago";
import { mpClient } from "../config/mp";
import { productosRepo } from "../repositories/products";
import { pedidosRepo } from "../repositories/pedidos";
import { enviosRepo } from "../repositories/envios";
import { pedidosDetalleRepo } from "../repositories/pedidosDetalles";
import dotenv from "dotenv";

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
  envio: {
    nombre: string;
    apellido: string;
    documento: string;
    provincia: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    codigo_postal: string;
    tipo_envio: string;
    email: string;
  };
  items: {
    product_id: number;
    quantity: number;
    color?: string;
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

  const productos = await Promise.all(
    items.map(item => productosRepo.findById(item.product_id))
  );

  const productosMap: {
    producto: any;
    quantity: number;
    color: string | null;
  }[] = [];

  items.forEach((item, index) => {
    const producto = productos[index];

    if (!producto) {
      throw new Error(`Producto ${item.product_id} no existe`);
    }

    if (producto.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }

    total += producto.precio * item.quantity;

    productosMap.push({
      producto,
      quantity: item.quantity,
      color: item.color ?? null
    });
  });

  const pedido = await pedidosRepo.create({
    usuario_id: userId,
    total,
    estado: "pendiente"
  });

  await enviosRepo.create({
    pedido_id: pedido.id,
    ...envio
  });

  await Promise.all(
    productosMap.map(item =>
      pedidosDetalleRepo.create({
        pedido_id: pedido.id,
        producto_id: item.producto.id,
        cantidad: item.quantity,
        precio_unitario: item.producto.precio,
        color: item.color
      })
    )
  );

  const preferenceId = await createPreferenceForCart({
    pedidoId: pedido.id,
    items: productosMap
  });

  await pedidosRepo.update(pedido.id, {
    preference_id: preferenceId
  });

  return { preferenceId };
};
