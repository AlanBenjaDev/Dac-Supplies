"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  TrendingUp,
  Loader2,
  Activity,
} from "lucide-react";

interface Producto {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  subtotal: number;
}

interface DashboardData {
  pedido_id: number;
  total_pedido: number;
  estado_pedido: string;
  fecha_envio: string;
  envio?: {
    envio_id: number;
    nombre: string;
    apellido: string;
    documento: string;
    telefono: string;
    provincia: string;
    ciudad: string | null;
    direccion: string | null;
    codigo_postal: string | null;
    email: string;
    envio_estado: "preparando" | "en_camino" | "entregado";
  };
  productos: Producto[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
        setData(result || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [API_URL]);

  // 🔹 Métricas de pedidos
  const pedidosPorEstado = useMemo(() => {
    const map = { preparando: 0, en_camino: 0, entregado: 0 };
    data.forEach((pedido) => {
      const estado = pedido.envio?.envio_estado ?? "preparando";
      map[estado] = (map[estado] || 0) + 1;
    });
    return map;
  }, [data]);

  const ingresosHoy = useMemo(() => {
    const hoy = new Date().toDateString();
    return data
      .filter((e) => new Date(e.fecha_envio).toDateString() === hoy)
      .reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0);
  }, [data]);

  const ingresosTotales = useMemo(() => {
    return data.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0);
  }, [data]);

  // 🔹 Productos individuales
  const productosIndividuales = useMemo(() => {
    return data.flatMap((pedido) =>
      pedido.productos.map((prod) => ({
        ...prod,
      }))
    );
  }, [data]);

  // 🔹 Productos agrupados
  const productosAgrupados = useMemo(() => {
    const mapa: Record<string, { unidades: number; total: number }> = {};
    productosIndividuales.forEach((prod) => {
      if (!mapa[prod.nombre_producto]) {
        mapa[prod.nombre_producto] = { unidades: 0, total: 0 };
      }
      mapa[prod.nombre_producto].unidades += prod.cantidad;
      mapa[prod.nombre_producto].total += Number(prod.subtotal);
    });
    return Object.entries(mapa)
      .map(([nombre, stats]) => ({ nombre, ...stats }))
      .sort((a, b) => b.unidades - a.unidades); // Top vendidos primero
  }, [productosIndividuales]);

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case "preparando":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "en_camino":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "entregado":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} className="text-black" />
            Consola de Operaciones
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Logística <span className="font-light italic text-gray-500">DAC Center</span>
          </h1>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <MetricCard icon={<Clock size={20} />} label="Preparando" value={pedidosPorEstado.preparando} />
          <MetricCard icon={<Truck size={20} />} label="En Camino" value={pedidosPorEstado.en_camino} />
          <MetricCard icon={<CheckCircle size={20} />} label="Entregados" value={pedidosPorEstado.entregado} />
          <MetricCard icon={<TrendingUp size={20} />} label="Ventas Hoy" value={`$${ingresosHoy.toLocaleString("es-AR")}`} />
          <MetricCard icon={<TrendingUp size={20} />} label="Ingresos Totales" value={`$${ingresosTotales.toLocaleString("es-AR")}`} />
        </div>

        {/* Tabla de pedidos */}
        <SectionTable data={data} getStatusStyle={getStatusStyle} />

        {/* Tabla de productos agrupados */}
        <SectionProductStats data={productosAgrupados} />
      </div>
    </div>
  );
}

// --------------------- COMPONENTES ---------------------

function MetricCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col items-start">
      <div className="mb-2">{icon}</div>
      <h3 className="text-xs text-gray-400 uppercase tracking-widest">{label}</h3>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function SectionTable({ data, getStatusStyle }: any) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto mb-16">
      <div className="p-8 border-b border-gray-50">
        <h2 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
          <Package size={16} /> Pedidos
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50">
          <tr>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Datos de Envío</th>
            <th className="px-6 py-4">Productos</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((pedido: DashboardData, idx: number) => (
            <tr key={idx}>
              <td className="px-6 py-6 font-bold uppercase text-sm">
                {pedido.envio?.nombre ?? "-"} {pedido.envio?.apellido ?? ""}
                <div className="text-[11px] text-gray-500">DNI: {pedido.envio?.documento ?? "-"}</div>
                <div className="text-[11px] text-gray-400">{pedido.envio?.email ?? "-"}</div>
              </td>

              <td className="px-6 py-6 text-[11px]">
                <div className="flex flex-col gap-1">
                  <span><strong>Tel:</strong> {pedido.envio?.telefono ?? "-"}</span>
                  <span><strong>Dirección:</strong> {pedido.envio?.direccion ?? "-"}</span>
                  <span>{pedido.envio?.ciudad ?? "-"}, {pedido.envio?.provincia ?? "-"}</span>
                  <span><strong>CP:</strong> {pedido.envio?.codigo_postal ?? "-"}</span>
                </div>
              </td>

              <td className="px-6 py-6 text-[11px]">
                {pedido.productos.map((p: Producto) => (
                  <div key={p.producto_id} className="flex justify-between">
                    <span>{p.nombre_producto} x{p.cantidad}</span>
                    <span>${Number(p.subtotal).toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </td>

              <td className="px-6 py-6 font-black">
                ${Number(pedido.total_pedido).toLocaleString("es-AR")}
              </td>

              <td className="px-6 py-6">
                <span className={`text-[10px] px-3 py-1 border rounded ${getStatusStyle(pedido.envio?.envio_estado ?? "preparando")}`}>
                  {pedido.envio?.envio_estado ?? "preparando"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionProductStats({ data }: any) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto mb-16">
      <div className="p-8 border-b border-gray-50">
        <h2 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
          <Package size={16} /> Productos Agrupados (Top vendidos)
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50">
          <tr>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Unidades Vendidas</th>
            <th className="px-6 py-4">Total Generado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="px-6 py-6 font-bold">{item.nombre}</td>
              <td className="px-6 py-6">{item.unidades}</td>
              <td className="px-6 py-6 font-black">${Number(item.total).toLocaleString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
