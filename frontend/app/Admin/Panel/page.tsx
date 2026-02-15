"use client";
import { useState, useEffect } from "react";
import FileUpload from "../SubirProducto";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { 
  PackagePlus, DollarSign, Box, Layers, AlignLeft, Activity, 
  Image as ImageIcon, Loader2, Trash2, ShieldCheck, Star 
} from "lucide-react";

export enum Categorias {
  proteinas = "proteinas",
  creatinas = "creatinas",
  colagenos = "colagenos",
  aminoacidos = "aminoacidos",
  vitaminas = "vitaminas",
  minerales = "minerales",
  pre_entrenos = "pre_entrenos",
  ganadores_peso = "ganadores_peso",
  salud_bienestar = "salud_bienestar",
  quemadores_grasa = "quemadores_grasa",
  otros = "otros",
}

interface Producto {
  id: string;
  producto: string;
  descripcion: string;
  precio: number;
  stock: number;
  img_url: string;
  categoria: string;
}

export default function AdminProducts() {
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<Producto[]>([]);
  const [fetching, setFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/products`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProductList(data);
    } catch (err) {
      toast.error("Error al cargar la lista de productos");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API_URL]);

  const handleDelete = async (id: string | number) => {
    const token = localStorage.getItem("accessToken");
    
    if (!id) {
      toast.error("Error: El producto no tiene un ID válido");
      console.error("ID recibido:", id);
      return;
    }

    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const targetUrl = `${baseUrl}/products/delete/${id}`;
      
    

      const res = await fetch(targetUrl, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

      if (res.ok) {
        toast.success("Producto eliminado");
        setProductList((prev) => prev.filter((p) => String(p.id) !== String(id)));
      } else if (res.status === 404) {
        toast.error("La ruta de borrado no existe (404). Revisá el prefijo en el backend.");
      } else if (res.status === 403) {
        toast.error("No tenés permisos de administrador.");
      } else {
        toast.error(`Error ${res.status}: No se pudo eliminar`);
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      toast.error("Error de conexión con el servidor");
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error("Debes cargar una imagen del producto");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    formData.append("producto", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("precio", data.precio);
    formData.append("stock", data.stock);
    formData.append("categoria", data.categoria);
    formData.append("imagen", selectedFile);

    try {
      const res = await fetch(`${API_URL}/products/create/product`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("¡Producto listado en DAC!");
        reset();
        setSelectedFile(null);
        fetchProducts(); // Recargar lista
      } else {
        toast.error("Error en la carga");
      }
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16 px-4 space-y-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-6 md:p-10 bg-white border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-black" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-50 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black text-white rounded-sm">
              <PackagePlus size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Gestión de Inventario</h4>
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">
                Nuevo <span className="font-light italic text-gray-500">Suplemento</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
            <Activity size={12} /> Portal Administrativo
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Nombre Comercial</label>
            <input {...register("nombre", { required: true })} placeholder="Ej: Whey Protein" className="bg-gray-50 border-none p-4 text-sm text-black rounded-sm focus:ring-1 focus:ring-black outline-none" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Categoría</label>
            <div className="relative">
              <select {...register("categoria")} className="w-full bg-gray-50 border-none p-4 text-sm text-black rounded-sm focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer">
                {Object.entries(Categorias).map(([key, value]) => (
                  <option key={key} value={value}>{value.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
              <Layers size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Precio ($)</label>
            <div className="relative">
                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input {...register("precio", { required: true })} type="number" placeholder="0.00" className="w-full bg-gray-50 border-none p-4 pl-10 text-sm text-black rounded-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Stock</label>
            <div className="relative">
                <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input {...register("stock", { required: true })} type="number" placeholder="Cant." className="w-full bg-gray-50 border-none p-4 pl-10 text-sm text-black rounded-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Información</label>
          <textarea {...register("descripcion")} rows={3} className="w-full bg-gray-50 border-none p-4 text-sm text-black rounded-sm focus:ring-1 focus:ring-black outline-none resize-none" />
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-sm p-8 text-center">
          <FileUpload onFileSelect={setSelectedFile} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 text-white py-5 font-bold rounded-sm transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Publicar en DAC Suplementos"}
        </button>
      </form>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <Activity size={12} className="text-black" /> Control de Stock
            </h4>
            <h1 className="text-4xl font-black text-black tracking-tighter">
              DAC <span className="font-light italic text-gray-600">Essentials</span>
            </h1>
          </div>
        </div>

        {fetching ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-200" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {productList.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] mb-5 overflow-hidden rounded-sm bg-white border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5">
                  {product.precio > 50000 && (
                    <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold px-2.5 py-1 tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={10} /> PREMIUM
                    </div>
                  )}
                  <img src={product.img_url} alt={product.producto} className="w-full h-full object-contain p-8" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-t border-gray-100 hidden md:block">
                     <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-tighter">Stock: {product.stock} un.</p>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-1 mb-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="black" className="text-black" />)}
                  </div>
                  <h2 className="text-black text-sm font-bold leading-tight line-clamp-2 mb-2 tracking-tight uppercase">
                    {product.producto}
                  </h2>
                  <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Precio</span>
                      <span className="text-lg font-black text-black">${Number(product.precio).toLocaleString('es-AR')}</span>
                    </div>

                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="h-10 w-10 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center rounded-full transition-all active:scale-90 border border-red-100"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}