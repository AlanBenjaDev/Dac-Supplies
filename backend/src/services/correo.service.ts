import axios from 'axios';

interface PaqArOrderResponse {
  id: string | number;
  trackingCode: string;
}

export class PaqArService {
  private baseUrl = process.env.PAQAR_URL || 'https://api.correoargentino.com.ar/paqar/v1';

  private getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PAQAR_API_KEY}`,
      'agreement': process.env.PAQAR_AGREEMENT || '',
      'Content-Type': 'application/json'
    };
  }

  async crearOrden(pedido: any) {
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
      const response = await axios.post<PaqArOrderResponse>(`${this.baseUrl}/orders`, body, { headers: this.getHeaders() });
      
      return {
        orderId: response.data.id, 
        trackingNumber: response.data.trackingCode
      };
    } catch (error: any) {
      console.error("Error PAQAR API:", error.response?.data || error.message);
      throw new Error("No se pudo generar la orden en el Correo");
    }
  }
// --- SERVICE AJUSTADO ---
async obtenerRotulo(orderId: string) {
  try {
    const response = await axios.get(`${this.baseUrl}/orders/${orderId}/label`, {
      headers: this.getHeaders(),
      responseType: 'arraybuffer' 
    });
    return response.data; 
  } catch (error: any) {
    throw new Error("La etiqueta aún no está disponible en el servidor del Correo");
  }
}


}

