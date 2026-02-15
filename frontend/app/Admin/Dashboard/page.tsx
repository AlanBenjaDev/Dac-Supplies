"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Search,
  TrendingUp,
  Loader2,
  Activity,
  ArrowUpRight
} from "lucide-react";



interface DashboardData {
  envio_id: number;
  tipo_envio: 'retiro_local' | 'moto' | 'correo';
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  envio_estado: 'preparando' | 'en_camino' | 'entregado';
  fecha_envio: string;
  pedido_id: number;
  producto_nombre: string;
  producto_precio: number;
  total_pedido: number;
  estado_pedido: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/payments/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error en el servidor");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [API_URL]);

  const pendientes = data.filter(e => e.envio_estado === 'preparando').length;
  const enCamino = data.filter(e => e.envio_estado === 'en_camino').length;
  const entregados = data.filter(e => e.envio_estado === 'entregado').length;
  const ingresosHoy = data
    .filter(e => new Date(e.fecha_envio).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + Number(curr.total_pedido), 0);

  const filteredEnvios = data.filter(e =>
    e.pedido_id.toString().includes(search) ||
    e.producto_nombre.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (estado: string) => {
    switch(estado) {
      case 'preparando': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'en_camino': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'entregado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black p-6 md:p-10 relative">
      {/* Barra estética superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header de Gestión DAC */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              <Activity size={14} className="text-black" /> Consola de Operaciones
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Logística <span className="font-light italic text-gray-500">DAC Center</span></h1>
          </div>
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center gap-2">
            + Ingresar Lote de Stock
          </button>
        </div>

        {/* Métricas con Estética "Health-Performance" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <MetricCard icon={<Clock size={20} />} label="Preparando" value={pendientes} color="text-amber-600" />
          <MetricCard icon={<Truck size={20} />} label="En Camino" value={enCamino} color="text-blue-600" />
          <MetricCard icon={<CheckCircle size={20} />} label="Entregados" value={entregados} color="text-emerald-600" />
          <MetricCard icon={<TrendingUp size={20} />} label="Ventas Hoy" value={`$${ingresosHoy.toLocaleString('es-AR')}`} color="text-black" isPrice />
        </div>

        {/* Monitor de Pedidos DAC */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="font-black flex items-center gap-3 text-black uppercase text-xs tracking-[0.2em]">
              <Package size={18} strokeWidth={1.5} /> Historial de Despacho
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
              <input 
                type="text" 
                placeholder="Buscar por ID o suplemento..." 
                className="w-full bg-gray-50 border-none rounded-sm py-3 pl-11 pr-4 text-xs text-black focus:ring-1 focus:ring-black transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-24 gap-4">
                <Loader2 className="animate-spin text-black" size={32} strokeWidth={1} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sincronizando base de datos</span>
              </div>
            ) : filteredEnvios.length === 0 ? (
              <div className="p-24 text-center">
                <p className="text-gray-300 font-bold uppercase tracking-[0.3em] text-[10px]">No se registran operaciones en este período</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 bg-gray-50/50">
                    <th className="px-8 py-5 font-black">Pedido / Referencia</th>
                    <th className="px-8 py-5 font-black">Método</th>
                    <th className="px-8 py-5 font-black">Destino de Entrega</th>
                    <th className="px-8 py-5 font-black">Importe</th>
                    <th className="px-8 py-5 font-black">Estado Actual</th>
                    <th className="px-8 py-5 font-black text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEnvios.map((envio) => (
                    <tr key={envio.envio_id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-black text-sm tracking-tighter mb-1">ID-{envio.pedido_id}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-bold truncate max-w-[140px] tracking-widest">
                            {envio.producto_nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[9px] bg-gray-100 px-3 py-1.5 rounded-sm text-gray-500 font-bold uppercase tracking-tighter border border-gray-200">
                          {envio.tipo_envio.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-gray-800 font-bold uppercase tracking-tighter truncate max-w-[180px]">{envio.direccion || 'DAC Store'}</span>
                          <span className="text-gray-400 text-[9px] uppercase tracking-widest font-medium">{envio.ciudad || 'Córdoba HQ'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-black text-sm">
                          ${Number(envio.total_pedido).toLocaleString('es-AR')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] px-3 py-1.5 rounded-sm border font-bold uppercase tracking-widest ${getStatusStyle(envio.envio_estado)}`}>
                          {envio.envio_estado}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 border border-gray-100 hover:bg-black hover:text-white rounded-sm transition-all text-gray-400 inline-flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase hidden md:inline">Ver</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color, isPrice = false }: any) {
  return (
    <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-xl hover:shadow-black/[0.02] transition-all">
      <div className={`p-3 w-fit rounded-sm bg-gray-50 ${color} group-hover:bg-black group-hover:text-white transition-colors`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">{label}</h3>
        <p className={`text-2xl font-black tracking-tighter ${isPrice ? 'text-black' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
      <div className="absolute top-0 right-0 p-2 opacity-5">
          {icon}
      </div>
    </div>
  );
}
