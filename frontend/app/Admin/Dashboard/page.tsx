"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Package, 
  CheckCircle, 
  TrendingUp, 
  Loader2, 
  Activity, 
  Layers, 
  Tag, 
  Clock,
  User,
  Phone,
  Mail,
  CreditCard
} from "lucide-react";

interface Pedido {
  pedido_id: number;
  total_pedido: number;
  estado_pago: string;
  fecha_envio: string;
  envio: {
    nombre: string;
    apellido: string;
    documento: string; // <-- Agregado
    provincia: string;
    ciudad: string;
    direccion: string;
    email: string; // <-- Agregado
    telefono: string; // <-- Agregado
  };
  productos: {
    detalle_id: number;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    personalizacion?: string | null;
  }[];
}

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_URL}/payments/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error servidor");
        const result = await res.json();
        setPedidos(result || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [API_URL]);

  const ingresosTotales = useMemo(() => 
    pedidos.reduce((acc, curr) => acc + Number(curr.total_pedido), 0), [pedidos]);
  
  const totalArticulosVendidos = useMemo(() => 
    pedidos.reduce((acc, p) => acc + p.productos.reduce((sum, pr) => sum + pr.cantidad, 0), 0), [pedidos]);

  const statsSeparadas = useMemo(() => {
    const combos: Record<string, any> = {};
    const normales: Record<string, any> = {};
    pedidos.forEach((p) => {
      p.productos.forEach((pr) => {
        const esCombo = pr.nombre_producto.toUpperCase().includes("COMBO");
        const target = esCombo ? combos : normales;
        if (!target[pr.nombre_producto]) target[pr.nombre_producto] = { unidades: 0, total: 0 };
        target[pr.nombre_producto].unidades += pr.cantidad;
        target[pr.nombre_producto].total += Number(pr.subtotal);
      });
    });
    const format = (obj: any) => Object.entries(obj).map(([nombre, s]: any) => ({ nombre, ...s })).sort((a, b) => b.unidades - a.unidades);
    return { listadoCombos: format(combos), listadoNormales: format(normales) };
  }, [pedidos]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} className="text-black" /> Consola de Operaciones
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Logística <span className="font-light italic text-gray-500">DAC Center</span>
          </h1>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard icon={<Package size={20} />} label="Pedidos Totales" value={pedidos.length} />
          <MetricCard icon={<TrendingUp size={20} />} label="Ingresos Brutos" value={`$${ingresosTotales.toLocaleString("es-AR")}`} />
          <MetricCard icon={<CheckCircle size={20} />} label="Unidades Salientes" value={totalArticulosVendidos} />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Clock size={18} className="text-gray-400" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Últimos Movimientos</h2>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto mb-16 rounded-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">ID / Fecha</th>
                <th className="px-6 py-4 border-b border-gray-100">Cliente y Contacto</th>
                <th className="px-6 py-4 border-b border-gray-100">Productos y Requerimientos</th>
                <th className="px-6 py-4 border-b border-gray-100">Total</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidos.map((p) => (
                <tr key={p.pedido_id} className="hover:bg-gray-50/30 transition-colors align-top">
                  <td className="px-6 py-6 font-bold">
                    <span className="text-black">#{p.pedido_id}</span>
                    <br/>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(p.fecha_envio).toLocaleDateString('es-AR')}
                    </span>
                  </td>

                  {/* COLUMNA DE CLIENTE ACTUALIZADA PARA DESPACHOS */}
                  <td className="px-6 py-6 min-w-[250px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 font-black text-[13px] uppercase tracking-tight">
                        <User size={14} className="text-blue-600" /> {p.envio.nombre} {p.envio.apellido}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                        <CreditCard size={13} className="text-gray-400" /> DNI: {p.envio.documento}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                        <Phone size={13} className="text-gray-400" /> {p.envio.telefono}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 lowercase">
                        <Mail size={13} className="text-gray-400" /> {p.envio.email}
                      </div>
                      <div className="mt-2 text-[10px] bg-gray-50 p-2 border border-gray-100 rounded-sm italic text-gray-500 leading-tight">
                        {p.envio.direccion}, {p.envio.ciudad} <br/> <strong>{p.envio.provincia}</strong>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 min-w-[320px]">
                    {p.productos.map((prod, i) => (
                      <div key={i} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-start">
                          <span className="font-black uppercase text-[11px] tracking-tight text-gray-800">
                            {prod.nombre_producto} 
                            <span className="text-blue-600 ml-2 bg-blue-50 px-1.5 py-0.5 rounded">x{prod.cantidad}</span>
                          </span>
                        </div>
                        {prod.personalizacion ? (
                          <div className="mt-2 bg-amber-50 border-l-4 border-amber-500 p-3 shadow-sm rounded-r-sm">
                            <p className="text-[9px] font-black uppercase text-amber-600 tracking-widest mb-1 flex items-center gap-1">
                              <Activity size={10} /> Requerimiento del Cliente:
                            </p>
                            <p className="text-[12px] font-bold text-amber-900 italic leading-snug">
                              "{prod.personalizacion}"
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-gray-300 italic">Sin notas.</div>
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-6 font-black text-base text-black">
                    ${Number(p.total_pedido).toLocaleString("es-AR")}
                  </td>

                  <td className="px-6 py-6 text-right">
                    <span className={`text-[9px] px-3 py-1.5 border-2 font-black uppercase rounded-full ${
                      p.estado_pago === "pagado" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {p.estado_pago}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <SectionProductStats title="Performance de Combos" icon={<Layers size={16}/>} data={statsSeparadas.listadoCombos} color="amber" />
           <SectionProductStats title="Productos Individuales" icon={<Tag size={16}/>} data={statsSeparadas.listadoNormales} color="blue" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col items-start transition-transform hover:scale-[1.01]">
      <div className="mb-2 text-black">{icon}</div>
      <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</h3>
      <p className="text-2xl font-black mt-1 tracking-tighter">{value}</p>
    </div>
  );
}

function SectionProductStats({ title, icon, data, color }: any) {
  const accent = color === "amber" ? "text-amber-600" : "text-blue-600";
  return (
    <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
      <div className="p-6 border-b border-gray-50 bg-gray-50/30">
        <h2 className={`font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 ${accent}`}>
          {icon} {title}
        </h2>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-[9px] uppercase tracking-widest text-gray-400 bg-white">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Vendidos</th>
            <th className="px-6 py-3 text-right">Recaudado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? data.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-gray-50/30">
              <td className="px-6 py-4 font-bold uppercase text-[11px] leading-tight text-gray-700">{item.nombre}</td>
              <td className="px-6 py-4 font-medium">{item.unidades}</td>
              <td className="px-6 py-4 font-black text-gray-600 text-right">${item.total.toLocaleString("es-AR")}</td>
            </tr>
          )) : (
            <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-300 italic text-xs">No hay datos.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}