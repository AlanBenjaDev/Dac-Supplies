"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, ShieldCheck, Loader2, Info } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

export default function SeccionProductos({ categoria }: { categoria: string }) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

useEffect(() => {
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const categoriaQuery = categoria.toLowerCase().replace("-", "_"); 
      
      const res = await fetch(`${API_URL}/products/${categoriaQuery}`);
      
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };
  fetchProductos();
}, [categoria, API_URL]);


  return (
    <section className="bg-[#FDFDFD] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-50 pb-8">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-2">DAC Suplementos</h4>
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
              {categoria.replace("_", " ")}
            </h2>
          </div>
          <p className="text-gray-400 text-xs font-medium italic">Resultados: {productos.length}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32"><Loader2 className="animate-spin text-black mb-4" size={40} /><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consultando Laboratorio...</p></div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-100 rounded-sm text-center">
            <Info className="text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No hay productos en {categoria}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productos.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white border border-gray-100 p-6 rounded-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                <Link href={`/Products/${product.id}`} className="relative aspect-square mb-6 overflow-hidden bg-[#F9F9F9] rounded-sm p-4 block">
                  <img src={product.img_url} alt={product.producto} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                </Link>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 mb-3"><ShieldCheck size={14} className="text-emerald-600" /><span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] italic">DAC Verified</span></div>
                  <Link href={`/Products/${product.id}`}><h3 className="text-sm font-black uppercase leading-tight mb-4 group-hover:text-gray-500 transition-colors line-clamp-2">{product.producto}</h3></Link>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col"><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inversión</span><span className="text-xl font-black text-black">${Number(product.precio).toLocaleString('es-AR')}</span></div>
                    <button className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-full hover:bg-gray-800 transition-all active:scale-90"><ShoppingCart size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
