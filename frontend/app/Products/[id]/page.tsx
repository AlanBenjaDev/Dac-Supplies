"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, CheckCircle2, Activity, Info } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [envio, setEnvio] = useState({
    ciudad: "",
    direccion: "",
    codigo_postal: "",
    tipo_envio: "correo"
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/products/${id}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="bg-white min-h-screen text-black p-10 font-bold">Producto no encontrado.</div>;

  const handleEnvioChange = (field: string, value: string) => {
    setEnvio((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreatePreference = async () => {
    if (!token) {
      toast.error("Iniciá sesión para comprar");
      return;
    }
    if (!envio.ciudad || !envio.direccion || !envio.codigo_postal) {
      toast.error("Completá los datos de envío");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, quantity: 1, envio }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (error) {
      toast.error("Error al iniciar el pago");
    }
  };

  const agregarAlCarrito = async (producto_id: number) => {
  if (product.stock <= 0) {
    toast.error("Has alcanzado el límite de stock disponible para este producto");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart/add/${producto_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ producto_id, cantidad: 1 }),
    });

    if (res.ok) {
      toast.success("Agregado al carrito");
      setProduct({ ...product, stock: product.stock - 1 });
    }
  } catch (error) {
    toast.error("Error al conectar con el servidor");
  }
};


  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al catálogo
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        <div className="lg:sticky lg:top-24 space-y-4">
            <div className="relative bg-white border border-gray-100 rounded-sm p-12 flex items-center justify-center min-h-[500px] shadow-sm">
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-black text-white text-[9px] font-bold px-3 py-1 tracking-widest uppercase">Original DAC</span>
                  {product.stock < 5 && <span className="bg-red-50 text-red-600 text-[9px] font-bold px-3 py-1 tracking-widest uppercase">Últimas unidades</span>}
              </div>
              <img
                  src={product.img_url}
                  alt={product.producto}
                  className="w-full h-auto max-h-[450px] object-contain mix-blend-multiply"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 p-4 rounded-sm text-center">
                    <CheckCircle2 size={16} className="mx-auto mb-2 text-emerald-600" />
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Pureza Testeada</p>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-sm text-center">
                    <ShieldCheck size={16} className="mx-auto mb-2 text-emerald-600" />
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Grado Pharma</p>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-sm text-center">
                    <Activity size={16} className="mx-auto mb-2 text-emerald-600" />
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Alto Rendimiento</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-4 tracking-tighter leading-none uppercase">{product.producto}</h1>
            <div className="flex items-center gap-4 mb-6">
                {/* PRECIO FORMATEADO AQUÍ */}
                <span className="text-3xl font-light text-gray-900">
                  ${Number(product.precio).toLocaleString('es-AR')}
                </span>
                <div className="h-4 w-[1px] bg-gray-200" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">En Stock</span>
            </div>
            <p className="text-gray-500 leading-relaxed text-lg font-light italic">
              {product.descripcion}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-sm p-8 mb-8 shadow-sm">
            <h3 className="text-black font-bold mb-6 uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              <Truck size={16} /> Información de Despacho
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Ciudad" 
                  className="w-full bg-gray-50 border-none p-4 text-sm rounded-sm focus:ring-1 focus:ring-black transition-all"
                  onChange={(e) => handleEnvioChange("ciudad", e.target.value)}
                />
                <input 
                  type="text" placeholder="Código Postal" 
                  className="w-full bg-gray-50 border-none p-4 text-sm rounded-sm focus:ring-1 focus:ring-black transition-all"
                  onChange={(e) => handleEnvioChange("codigo_postal", e.target.value)}
                />
              </div>
              <input 
                type="text" placeholder="Dirección Completa" 
                className="w-full bg-gray-50 border-none p-4 text-sm rounded-sm focus:ring-1 focus:ring-black transition-all"
                onChange={(e) => handleEnvioChange("direccion", e.target.value)}
              />
              
              {Number(product.precio) > 15000 && (
                <div className="flex items-center gap-2 text-emerald-600 pt-2">
                  <Info size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Envío gratis habilitado para esta orden</p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-3">
            <button
              onClick={handleCreatePreference}
              className="w-full bg-[#009ee3] hover:brightness-110 text-white font-bold py-5 rounded-sm transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase"
            >
              Comprar Ahora
            </button>

            <button
              onClick={() => agregarAlCarrito(product.id)}
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-5 rounded-sm transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase active:scale-[0.98]"
            >
              <ShoppingCart size={18} /> Agregar al Carrito
            </button>

            {preferenceId && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                <p className="text-[10px] text-blue-600 font-bold uppercase text-center mb-4 tracking-widest">Plataforma segura Mercado Pago</p>
                <Wallet initialization={{ preferenceId }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
