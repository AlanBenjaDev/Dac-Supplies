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
  precio_unitario: number;
  subtotal: number;
}

interface DashboardData {
  pedido_id: number;
  total_pedido: number;
  estado_pedido: string;
  fecha_envio: string;
  envio?: {
    envio_id: number;
    tipo_envio: string;
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

  const pendientes = data.filter((e) => e.envio?.envio_estado === "preparando").length;
  const enCamino = data.filter((e) => e.envio?.envio_estado === "en_camino").length;
  const entregados = data.filter((e) => e.envio?.envio_estado === "entregado").length;

  const ingresosHoy = data
    .filter(
      (e) =>
        new Date(e.fecha_envio).toDateString() ===
        new Date().toDateString()
    )
    .reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    return data.filter((pedido) => {
      const envio = pedido.envio;

      return (
        pedido.pedido_id.toString().includes(term) ||
        envio?.apellido?.toLowerCase().includes(term) ||
        envio?.nombre?.toLowerCase().includes(term) ||
        envio?.documento?.includes(term) ||
        envio?.telefono?.includes(term) ||
        envio?.email?.toLowerCase().includes(term) ||
        pedido.productos?.some((p) =>
          p.nombre_producto?.toLowerCase().includes(term)
        )
      );
    });
  }, [data, search]);

  // 🔥 NORMALIZAMOS PEDIDOS (para que la tabla no dependa de item.envio)
  const pedidosConEnvioPlano = useMemo(() => {
    return filtered.map((pedido) => ({
      pedido_id: pedido.pedido_id,
      nombre: pedido.envio?.nombre ?? "-",
      apellido: pedido.envio?.apellido ?? "",
      documento: pedido.envio?.documento ?? "-",
      telefono: pedido.envio?.telefono ?? "-",
      direccion: pedido.envio?.direccion ?? "-",
      ciudad: pedido.envio?.ciudad ?? "-",
      provincia: pedido.envio?.provincia ?? "-",
      codigo_postal: pedido.envio?.codigo_postal ?? "-",
      email: pedido.envio?.email ?? "-",
      productos: pedido.productos,
      total_pedido: pedido.total_pedido,
      estado: pedido.envio?.envio_estado ?? "preparando",
    }));
  }, [filtered]);

  const productosIndividuales = useMemo(() => {
    return pedidosConEnvioPlano.flatMap((pedido) =>
      pedido.productos.map((prod) => ({
        ...pedido,
        nombre_producto: prod.nombre_producto,
        cantidad: prod.cantidad,
        subtotal: prod.subtotal,
      }))
    );
  }, [pedidosConEnvioPlano]);

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

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} className="text-black" />
            Consola de Operaciones
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Logística <span className="font-light italic text-gray-500">DAC Center</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <MetricCard icon={<Clock size={20} />} label="Preparando" value={pendientes} />
          <MetricCard icon={<Truck size={20} />} label="En Camino" value={enCamino} />
          <MetricCard icon={<CheckCircle size={20} />} label="Entregados" value={entregados} />
          <MetricCard icon={<TrendingUp size={20} />} label="Ventas Hoy" value={`$${ingresosHoy.toLocaleString("es-AR")}`} />
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        ) : (
          <>
            <SectionTable
              title="Productos por Carrito"
              data={pedidosConEnvioPlano}
              getStatusStyle={getStatusStyle}
              isUnit={false}
            />

            <SectionTable
              title="Productos por Unidad"
              data={productosIndividuales}
              getStatusStyle={getStatusStyle}
              isUnit={true}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SectionTable({ title, data, getStatusStyle, isUnit }: any) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto mb-16">
      <div className="p-8 border-b border-gray-50">
        <h2 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
          <Package size={16} /> {title}
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50">
          <tr>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Datos de Envío</th>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((item: any, index: number) => (
            <tr key={index}>
              <td className="px-6 py-6">
                <div className="font-bold uppercase text-sm">
                  {item.nombre} {item.apellido}
                </div>
                <div className="text-[11px] text-gray-500">
                  DNI: {item.documento}
                </div>
                <div className="text-[11px] text-gray-400">
                  {item.email}
                </div>
              </td>

              <td className="px-6 py-6 text-[11px]">
                <div className="flex flex-col gap-1">
                  <span><strong>Tel:</strong> {item.telefono}</span>
                  <span><strong>Dirección:</strong> {item.direccion}</span>
                  <span>{item.ciudad}, {item.provincia}</span>
                  <span><strong>CP:</strong> {item.codigo_postal}</span>
                </div>
              </td>

              <td className="px-6 py-6 text-[11px]">
                {isUnit ? (
                  <div className="flex justify-between">
                    <span>{item.nombre_producto} x{item.cantidad}</span>
                    <span>${Number(item.subtotal).toLocaleString("es-AR")}</span>
                  </div>
                ) : (
                  item.productos?.map((p: any) => (
                    <div key={p.producto_id} className="flex justify-between">
                      <span>{p.nombre_producto} x{p.cantidad}</span>
                      <span>${Number(p.subtotal).toLocaleString("es-AR")}</span>
                    </div>
                  ))
                )}
              </td>

              <td className="px-6 py-6 font-black">
                ${Number(isUnit ? item.subtotal : item.total_pedido).toLocaleString("es-AR")}
              </td>

              <td className="px-6 py-6">
                <span className={`text-[10px] px-3 py-1 border rounded ${getStatusStyle(item.estado)}`}>
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 border border-gray-100 shadow-sm">
      <div className="mb-2">{icon}</div>
      <h3 className="text-xs text-gray-400 uppercase tracking-widest">{label}</h3>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
