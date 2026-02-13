"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Star, ShieldCheck, Activity } from "lucide-react";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

export default function ProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${API_URL}/products/products`);
        if (!res.ok) throw new Error("Error al traer productos");
        const data: Product[] = await res.json();
        setProductList(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-800 bg-white">
      <p className="text-xl font-light tracking-tight">⚠️ {error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-black font-bold underline decoration-1 underline-offset-4 hover:opacity-70">
        Reintentar
      </button>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-20 px-6 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-medium">Cargando catálogo</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFBFB] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado Sofisticado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <Activity size={12} className="text-black" /> Rendimiento & Bienestar
            </h4>
            <h1 className="text-4xl font-black text-black tracking-tighter">
              DAC <span className="font-light italic text-gray-600">Essentials</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed border-l border-gray-200 pl-4">
            Suplementación de grado profesional diseñada para alcanzar tu mejor versión.
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {productList.map((product) => (
            <div key={product.id} className="group flex flex-col">
              
              {/* Contenedor de Imagen */}
              <div className="relative aspect-[4/5] mb-5 overflow-hidden rounded-sm bg-white border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5">
                
                {/* Badge de Calidad/Envío */}
                {product.precio > 50000 && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold px-2.5 py-1 tracking-widest flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck size={10} /> PREMIUM
                  </div>
                )}

                <Link href={`/Products/${product.id}`} className="block h-full w-full">
                  <img
                    src={product.img_url}
                    alt={product.producto}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-t border-gray-100 hidden md:block">
                   <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-tighter">Stock Disponible: {product.stock} un.</p>
                </div>
              </div>
              
              {/* Info del Producto */}
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="black" className="text-black" />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">(4.9)</span>
                </div>

                <Link href={`/Products/${product.id}`}>
                  <h2 className="text-black text-sm font-bold leading-tight line-clamp-2 hover:text-gray-600 transition-colors mb-2 tracking-tight">
                      {product.producto.toUpperCase()}
                  </h2>
                </Link>

                <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Precio</span>
                    <span className="text-lg font-black text-black">
                      {/* Formateo de Argentina: 56.000 */}
                      ${Number(product.precio).toLocaleString('es-AR')}
                    </span>
                  </div>

                  <button className="h-10 w-10 bg-black hover:bg-gray-800 text-white flex items-center justify-center rounded-full transition-all active:scale-90 shadow-lg shadow-black/10">
                    <ShoppingCart size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
