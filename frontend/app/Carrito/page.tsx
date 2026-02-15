"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Carrito } from "./utils";
import { calcularTotal } from "./utils";
import Link from "next/link";
import { ShoppingBag, Trash2, ShieldCheck, Truck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "", { locale: "es-AR" });

export default function CarritoList() {
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false); 
  const [token, setToken] = useState<string | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
   const [envio, setEnvio] = useState({
    ciudad: "",
    direccion: "",
    codigo_postal: "",
    tipo_envio: "correo"
  });
  
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
      setIsTokenChecked(true);
    }
  }, []);


  useEffect(() => {
    if (!token || !API_URL) return; 
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setCarrito(data);
      } catch (err) {
        toast.error("No pudimos sincronizar tu carrito");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, API_URL]);

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

  setPaying(true); 

  try {
    const res = await fetch(`${API_URL}/payments/checkout`, { 
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        envio,
      }),
    });
    
    if (!res.ok) throw new Error();
    const data = await res.json();
    setPreferenceId(data.preferenceId);
  } catch (error) {
    toast.error("Error al iniciar el pago");
  } finally {
    setPaying(false);
  }
};


const handleDeleteItem = async (idDeLaFila: number) => {
  try {
    const res = await fetch(`${API_URL}/cart/delete/${idDeLaFila}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      // Filtramos por el ID de la fila para que desaparezca de la vista
      setCarrito((prev) => prev.filter((item) => item.id !== idDeLaFila));
      toast.success("Eliminado");
    }
  } catch (error) {
    toast.error("Error al borrar");
  }
};


  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-[#FBFBFB] text-black flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
            <ShoppingBag size={60} strokeWidth={1} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Carrito Vacío</h1>
        <p className="text-gray-400 text-sm max-w-xs mb-8 font-medium">Tu plan de suplementación está esperando. Agregá productos para comenzar.</p>
        <Link href="/Products" className="bg-black text-white px-10 py-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-xl">
          Explorar Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12 border-b border-gray-100 pb-8">
          <Link href="/Products" className="group p-3 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Finalizar Pedido</h4>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Tu <span className="font-light italic text-gray-500">Selección</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {carrito.map((cart) => (
              <div key={cart.id} className="bg-white border border-gray-100 p-5 md:p-8 rounded-sm flex items-center gap-8 hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-50">
                  <img src={cart.img_url} alt={cart.producto} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-sm md:text-lg font-black uppercase tracking-tight text-black line-clamp-1">{cart.producto}</h2>
                    <button 
                    onClick={handleDeleteItem.bind(null, cart.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calidad DAC Verificada</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-xl font-light text-black">${cart.precio.toLocaleString('es-AR')}</p>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-gray-100 px-3 py-1 rounded-full">Cant: {cart.cantidad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
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
            <div className="bg-white border border-gray-100 rounded-sm p-10 sticky top-24 shadow-2xl shadow-black/[0.02]">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-4 text-gray-400">Resumen de Orden</h2>
              
              
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal ({carrito.length} ítems)</span>
                  <span className="font-bold">${calcularTotal(carrito).toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Logística y Envío</span>
                  <span className="text-emerald-600 font-bold uppercase text-xs tracking-widest">Sin Cargo</span>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Final</span>
                    <div className="text-right">
                        <p className="text-4xl font-black text-black tracking-tighter leading-none">
                        ${calcularTotal(carrito).toLocaleString('es-AR')}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-2 tracking-widest italic">Impuestos incluidos</p>
                    </div>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                {!preferenceId ? (
                  <button
                    onClick={handleCreatePreference}
                    disabled={paying}
                    className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-100 text-white font-bold py-5 rounded-sm transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-black/10 active:scale-[0.98]"
                  >
                    {paying ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Proceder al Pago"
                    )}
                  </button>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 bg-blue-50/50 rounded-sm border border-blue-100">
                    <p className="text-[9px] text-blue-500 font-bold uppercase text-center mb-4 tracking-widest">Plataforma Segura Mercado Pago</p>
                    <Wallet initialization={{ preferenceId }} />
                  </div>
                )}
              </div>

              {/* Garantías */}
              <div className="mt-12 space-y-5 border-t border-gray-50 pt-8">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-black" />
                  <span>Garantía de Satisfacción DAC</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Truck size={16} className="text-black" />
                  <span>Entrega prioritaria 24/48hs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
