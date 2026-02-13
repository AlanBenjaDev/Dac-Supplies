"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, ArrowRight, Activity } from "lucide-react";

type FormData = {
  user: string;
  email: string;
  password: string;
};

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("¡Cuenta creada!", {
          description: "Bienvenido a la comunidad DAC.",
          style: { background: '#fff', color: '#000', border: '1px solid #e5e7eb' }
        });
        router.push("/Login");
      } else {
        toast.error(result.error || "Error al registrar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Detalle estético superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black" />
      
      <div className="w-full max-w-[460px] z-10 py-12">
        {/* Logo Branding */}
        <div className="flex justify-center mb-8">
            <div className="bg-black text-white px-4 py-2 font-black text-2xl tracking-tighter shadow-xl">
                DAC
            </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-100 p-10 rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.04)]"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
                <Activity size={24} className="text-black" />
            </div>
            <h1 className="text-black font-black text-2xl tracking-tighter uppercase mb-2">
               Crear <span className="font-light italic text-gray-500">Perfil</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Unite a DAC Suplementos</p>
          </div>

          <div className="space-y-5">
            {/* Username */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nombre de Usuario</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
                <input
                  type="text"
                  {...register("user", { required: "El usuario es obligatorio" })}
                  className="w-full bg-gray-50 border-none p-4 pl-12 text-sm text-black rounded-sm placeholder-gray-300 focus:ring-1 focus:ring-black transition-all"
                  placeholder="ej: juan_fit"
                />
              </div>
              {errors.user && <p className="text-red-500 text-[9px] font-bold uppercase mt-1 tracking-tighter">{errors.user.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Personal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: "Email no válido" },
                  })}
                  className="w-full bg-gray-50 border-none p-4 pl-12 text-sm text-black rounded-sm placeholder-gray-300 focus:ring-1 focus:ring-black transition-all"
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[9px] font-bold uppercase mt-1 tracking-tighter">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                  })}
                  className="w-full bg-gray-50 border-none p-4 pl-12 text-sm text-black rounded-sm placeholder-gray-300 focus:ring-1 focus:ring-black transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-[9px] font-bold uppercase mt-1 tracking-tighter">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 text-white py-5 rounded-sm transition-all font-bold text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3 shadow-lg shadow-black/5 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Confirmar Registro <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          <div className="text-center mt-10 pt-8 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              ¿YA ERES MIEMBRO?{" "}
              <a href="/Login" className="text-black border-b border-black pb-0.5 hover:opacity-60 transition-all ml-1">
                INICIÁ SESIÓN
              </a>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-medium leading-loose">
                Al registrarte, aceptas nuestros <br />
                <span className="text-black">Términos de Salud y Privacidad</span>
            </p>
        </div>
      </div>
    </div>
  );
}
