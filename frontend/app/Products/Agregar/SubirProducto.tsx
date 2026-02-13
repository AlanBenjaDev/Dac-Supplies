"use client";
import { useState } from "react";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";

export default function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file); 
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full group">
      {!preview ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer bg-white hover:bg-gray-50 hover:border-black transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-black group-hover:text-white transition-all duration-500">
              <Upload className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <p className="mb-1 text-[11px] text-gray-500 tracking-[0.2em] uppercase font-bold text-center px-4">
              Arrastra o <span className="text-black underline underline-offset-4">selecciona</span> <br /> el packshot del producto
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2">
              JPG, WEBP o PNG • MÁX 5MB
            </p>
          </div>
          <input
            id="file-upload"
            name="imagen"              
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative w-full h-56 bg-white rounded-sm border border-gray-100 overflow-hidden group shadow-inner">
          <img 
            src={preview} 
            alt="Vista previa" 
            className="w-full h-full object-contain p-6 mix-blend-multiply" 
          />
          
          {/* Overlay de edición - Sofisticado */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
            <button 
              onClick={removeImage}
              className="flex flex-col items-center gap-2 group/btn"
              title="Eliminar imagen"
            >
              <div className="p-3 bg-red-50 text-red-500 rounded-full group-hover/btn:bg-red-500 group-hover/btn:text-white transition-all">
                <X size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">Eliminar</span>
            </button>

            <label htmlFor="file-upload" className="flex flex-col items-center gap-2 group/btn cursor-pointer">
               <div className="p-3 bg-gray-100 text-black rounded-full group-hover/btn:bg-black group-hover/btn:text-white transition-all">
                  <ImageIcon size={20} />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest text-black">Cambiar</span>
               <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Badge de archivo cargado */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-sm border border-emerald-100">
                <Check size={10} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Imagen Lista</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
