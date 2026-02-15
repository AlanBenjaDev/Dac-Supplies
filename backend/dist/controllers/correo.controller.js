"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descargarEtiqueta = exports.generarEnvioPaqAr = void 0;
const correo_service_1 = require("../services/correo.service");
const pedidos_1 = require("../repositories/pedidos");
const paqArService = new correo_service_1.PaqArService();
const generarEnvioPaqAr = async (req, res) => {
    try {
        const { pedidoId } = req.params;
        const idNumerico = Number(pedidoId); // Convertimos una sola vez a número
        const pedido = await pedidos_1.pedidosRepo.findById(idNumerico);
        if (!pedido)
            return res.status(404).json({ message: "Pedido no encontrado" });
        // Casteamos el resultado a nuestra interfaz para que TS no diga "unknown"
        const resultadoCorreo = await paqArService.crearOrden(pedido);
        // 3. ACTUALIZAMOS TU DB: Usamos idNumerico para evitar el error de tipos
        await pedidos_1.pedidosRepo.update(idNumerico, {
            correo_order_id: resultadoCorreo.orderId.toString(),
            tracking_number: resultadoCorreo.trackingNumber,
            estado: "enviado_a_logistica"
        });
        res.status(200).json({
            message: "Orden creada con éxito",
            tracking: resultadoCorreo.trackingNumber
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al conectar con PAQ.AR" });
    }
};
exports.generarEnvioPaqAr = generarEnvioPaqAr;
const descargarEtiqueta = async (req, res) => {
    try {
        const { orderId } = req.params;
        const pdfData = await paqArService.obtenerRotulo(orderId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=etiqueta-dac-${orderId}.pdf`);
        res.send(Buffer.from(pdfData));
    }
    catch (error) {
        console.error("Error descarga:", error);
        res.status(500).json({ error: "No se pudo generar la previsualización del rótulo" });
    }
};
exports.descargarEtiqueta = descargarEtiqueta;
