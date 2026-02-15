import { Request, Response } from 'express';
import { PaqArService } from '../services/correo.service';
import { pedidosRepo } from '../repositories/pedidos';

const paqArService = new PaqArService();

// Definimos una interfaz para que TS sepa qué devuelve el servicio de correo
interface ResultadoCorreo {
  orderId: string | number;
  trackingNumber: string;
}

export const generarEnvioPaqAr = async (req: Request, res: Response) => {
  try {
    const { pedidoId } = req.params;
    const idNumerico = Number(pedidoId); // Convertimos una sola vez a número

    const pedido = await pedidosRepo.findById(idNumerico);
    
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

    // Casteamos el resultado a nuestra interfaz para que TS no diga "unknown"
    const resultadoCorreo = await paqArService.crearOrden(pedido) as ResultadoCorreo;

    // 3. ACTUALIZAMOS TU DB: Usamos idNumerico para evitar el error de tipos
    await pedidosRepo.update(idNumerico, {
      correo_order_id: resultadoCorreo.orderId.toString(), 
      tracking_number: resultadoCorreo.trackingNumber,
      estado: "enviado_a_logistica"
    });

    res.status(200).json({ 
      message: "Orden creada con éxito", 
      tracking: resultadoCorreo.trackingNumber 
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al conectar con PAQ.AR" });
  }
};

export const descargarEtiqueta = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; 
const pdfData = await paqArService.obtenerRotulo(orderId);

res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `inline; filename=etiqueta-dac-${orderId}.pdf`);

res.send(Buffer.from(pdfData as any)); 
    
        
  } catch (error) {
    console.error("Error descarga:", error);
    res.status(500).json({ error: "No se pudo generar la previsualización del rótulo" });
  }
};