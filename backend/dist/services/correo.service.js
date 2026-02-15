"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaqArService = void 0;
const axios_1 = __importDefault(require("axios"));
class PaqArService {
    constructor() {
        this.baseUrl = process.env.PAQAR_URL || 'https://api.correoargentino.com.ar/paqar/v1';
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${process.env.PAQAR_API_KEY}`,
            'agreement': process.env.PAQAR_AGREEMENT || '',
            'Content-Type': 'application/json'
        };
    }
    async crearOrden(pedido) {
        const body = {
            senderData: {
                zipCode: "1425",
                city: "CABA"
            },
            shippingData: {
                name: pedido.nombre_cliente,
                email: pedido.email_cliente,
                address: {
                    streetName: pedido.direccion,
                    streetNumber: "0",
                    zipCode: pedido.codigo_postal,
                    state: "X"
                }
            },
            parcels: [{
                    weight: pedido.peso_total || "1.0",
                    dimensions: { height: "15", width: "20", depth: "25" },
                    declaredValue: pedido.total.toString()
                }]
        };
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/orders`, body, { headers: this.getHeaders() });
            return {
                orderId: response.data.id,
                trackingNumber: response.data.trackingCode
            };
        }
        catch (error) {
            console.error("Error PAQAR API:", error.response?.data || error.message);
            throw new Error("No se pudo generar la orden en el Correo");
        }
    }
    // --- SERVICE AJUSTADO ---
    async obtenerRotulo(orderId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/orders/${orderId}/label`, {
                headers: this.getHeaders(),
                responseType: 'arraybuffer' // Correcto para archivos binarios
            });
            return response.data;
        }
        catch (error) {
            // PAQ.AR a veces devuelve el error en el header si el PDF no está listo
            throw new Error("La etiqueta aún no está disponible en el servidor del Correo");
        }
    }
}
exports.PaqArService = PaqArService;
