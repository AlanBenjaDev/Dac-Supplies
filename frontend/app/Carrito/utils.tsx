export interface Carrito {
  product_id: number;
  nombre: string;
  precio: number;
  quantity: number;
  img_url: string;
  color?: string | null;
}
export const calcularTotal = (carrito: Carrito[] = []): number =>
  carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);