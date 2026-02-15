// Basado en los requisitos de /rates y /shipping/import [cite: 236, 326]
export interface RateRequest {
  postalCodeOrigin: string;
  postalCodeDestination: string;
  dimensions: {
    weight: number; // en gramos 
    height: number;
    width: number;
    length: number;
  };
  deliveredType?: 'D' | 'S'; // D: puerta a puerta, S: sucursal a sucursal 
}

export interface AuthResponse {
  token: string;
  expires: string;
}