"use client";
import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Truck } from "lucide-react";
import confetti from "canvas-confetti"; // Opcional: npm install canvas-confetti

export default function Success() {

  useEffect(() => {

    localStorage.removeItem("cart");
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#10b981', '#ffffff']
    });
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icono de éxito minimalista */}
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-50 p-6 rounded-full">
            <CheckCircle size={64} className="text-emerald-600" strokeWidth={1} />
          </div>
        </div>

        <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mb-2">
          Transacción Completada
        </h4>
        <h1 className="text-4xl font-black text-black tracking-tighter mb-4 uppercase">
          ¡Gracias por <br /> <span className="font-light italic text-gray-500">tu confianza!</span>
        </h1>
        
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          Tu pago fue procesado con éxito. En breve recibirás un correo con el 
          <strong> número de seguimiento</strong> para que monitorees tu pedido.
        </p>

        {/* Pasos a seguir (Informativo) */}
        <div className="bg-gray-50 border border-gray-100 rounded-sm p-6 mb-10 text-left space-y-4">
          <div className="flex items-start gap-4">
            <Package size={20} className="text-black shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-tight">Preparación</p>
              <p className="text-[10px] text-gray-400">Estamos armando tu combo DAC.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Truck size={20} className="text-black shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-tight">Despacho</p>
              <p className="text-[10px] text-gray-400">Lo entregaremos en la sucursal del Correo Argentino en las próximas 24hs.</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/Products" 
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            Seguir Comprando <ArrowRight size={14} />
          </Link>
          <Link 
            href="/MisPedidos" 
            className="w-full bg-white text-black border border-gray-100 py-4 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-all"
          >
            Ver mis pedidos
          </Link>
        </div>

        <p className="mt-12 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} DAC Suplementos • Córdoba, Argentina
        </p>
      </div>
    </main>
  );
}
