"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./SubirProducto";
import { toast } from "sonner";
import { PackagePlus, DollarSign, Box, Layers, AlignLeft, Activity, Image as ImageIcon, Loader2 } from "lucide-react";

// Definimos el Enum para que sea accesible en el componente
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

export default function AddProduct() {
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    formData.append("categoria", data.categoria); // Enviará el valor del enum (ej: "pre_entrenos")
    formData.append("imagen", selectedFile); 

    try {
      const res = await fetch(`${API_URL}/products/create/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData, 
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("¡Producto listado en DAC!", {
          style: { background: '#fff', color: '#000', border: '1px solid #e5e7eb' }
        });
        reset();
        setSelectedFile(null);
      } else {
        toast.error("Error en la carga", { description: JSON.stringify(result) });
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-black" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-10 bg-white border border-gray-100 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex flex-col gap-8 relative overflow-hidden"
      >
        {/* Header estético */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-50 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black text-white rounded-sm shadow-xl">
              <PackagePlus size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Gestión de Inventario</h4>
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">
                Nuevo <span className="font-light italic text-gray-500">Suplemento</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
             <Activity size={12} /> Portal Administrativo
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
              Nombre Comercial
            </label>
            <input 
              {...register("nombre", { required: true })} 
              placeholder="Ej: Whey Protein 1kg" 
              className="bg-gray-50 border-none p-4 text-sm text-black rounded-sm placeholder-gray-300 focus:ring-1 focus:ring-black transition-all outline-none" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
              Categoría Salud
            </label>
            <div className="relative">
              <select 
                {...register("categoria")} 
                className="w-full bg-gray-50 border-none p-4 text-sm text-black rounded-sm focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer"
              >
                {/* Mapeo dinámico del Enum para evitar errores de tipeo */}
                {Object.entries(Categorias).map(([key, value]) => (
                  <option key={key} value={value}>
                    {/* Reemplazamos guiones bajos por espacios y capitalizamos para la vista del usuario */}
                    {value.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              <Layers size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
              Precio de Venta ($)
            </label>
            <div className="relative">
                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  {...register("precio", { required: true })} 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full bg-gray-50 border-none p-4 pl-10 text-sm text-black rounded-sm outline-none focus:ring-1 focus:ring-black" 
                />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
              Unidades en Stock
            </label>
            <div className="relative">
                <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  {...register("stock", { required: true })} 
                  type="number" 
                  placeholder="Cant." 
                  className="w-full bg-gray-50 border-none p-4 pl-10 text-sm text-black rounded-sm outline-none focus:ring-1 focus:ring-black" 
                />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
            Información del Producto
          </label>
          <div className="relative">
            <AlignLeft size={14} className="absolute left-4 top-4 text-gray-300" />
            <textarea 
              {...register("descripcion")} 
              placeholder="Detalles nutricionales, beneficios y modo de uso..." 
              rows={3}
              className="w-full bg-gray-50 border-none p-4 pl-10 text-sm text-black rounded-sm placeholder-gray-300 focus:ring-1 focus:ring-black outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 ml-1 flex items-center gap-2">
             <ImageIcon size={14} /> Packshot Oficial
          </label>
          <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-sm p-8 hover:bg-gray-100 transition-all text-center">
            <FileUpload onFileSelect={setSelectedFile} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 text-white py-5 font-bold rounded-sm transition-all shadow-xl shadow-black/10 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Publicar en DAC Suplementos"
          )}
        </button>
      </form>
    </div>
  );
}
