"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, CheckCircle2, Activity, Info, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
  tipo: string;
}

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [creatingPreference, setCreatingPreference] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const [color, setColor] = useState<string | null>(null);
  const [opcionesCombo, setOpcionesCombo] = useState<Record<string, string>>({});
  const [notasExtra, setNotasExtra] = useState("");

  const [envio, setEnvio] = useState({
    nombre: "", apellido: "", documento: "", provincia: "",
    ciudad: "", direccion: "", codigo_postal: "", tipo_envio: "correo",
    telefono: "", email: ""
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const saboresDisponibles = ["Vainilla", "Chocolate", "Frutilla", "Neutro", "Uva", "Limón"];

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  const isBidon = product?.tipo === "bidon";
  const isCombo = product?.tipo === "combo";

  const detectarComponentes = () => {
    if (!product) return [];
    const nombre = product.producto.toLowerCase();
    const posibles = ["Proteína", "Creatina", "BCAA", "Pre-Workout"];
    return posibles.filter(p => nombre.includes(p.toLowerCase()));
  };

  const componentesDetectados = detectarComponentes();

  // ESTA ES LA ACLARACIÓN DINÁMICA QUE ME PEDISTE
  const obtenerAclaracionNotas = () => {
    if (isBidon) return "Aclará aquí si tenés alguna preferencia de entrega o detalle del color.";
    if (isCombo) return "Podés detallar aquí sabores específicos o si querés cambiar algún componente (sujeto a stock).";
    return "Aclará aquí el sabor, color o detalles específicos de tu pedido.";
  };

  const handleCreatePreference = async () => {
    if (!envio.nombre || !envio.direccion || !envio.telefono) {
      toast.error("Completá los datos de despacho");
      return;
    }

    let info_adicional = "";
    if (isBidon && color) info_adicional = `Color: ${color}`;
    if (isCombo) {
      info_adicional = Object.entries(opcionesCombo)
        .map(([key, val]) => `${key}: ${val}`)
        .join(", ");
    }

    if (notasExtra) info_adicional += (info_adicional ? " | " : "") + `Notas: ${notasExtra}`;

    try {
      setCreatingPreference(true);
      const res = await fetch(`${API_URL}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({
          userId: null,
          envio,
          items: [{
            product_id: product?.id,
            quantity: 1,
            opciones: { info_adicional }
          }]
        })
      });
      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (error) {
      toast.error("Error al procesar pago");
    } finally {
      setCreatingPreference(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse">Cargando...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Volver al catálogo
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white border border-gray-100 rounded-sm p-12 flex items-center justify-center shadow-sm h-fit">
          <img src={product.img_url} alt={product.producto} className="max-h-[450px] object-contain" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter leading-none">{product.producto}</h1>
          <p className="text-3xl font-light mb-8">${Number(product.precio).toLocaleString("es-AR")}</p>

          {isBidon && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase mb-3 text-gray-400 tracking-widest">Seleccionar Color</h3>
              <div className="flex gap-4">
                {["Negro", "Azul", "Rosa", "Amarillo"].map((c) => (
                  <button 
                    key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 border text-[10px] font-bold uppercase transition-all ${color === c ? "bg-black text-white" : "bg-white text-gray-300 border-gray-100"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isCombo && (
            <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-sm space-y-4">
              <h3 className="text-xs font-bold uppercase flex items-center gap-2"><Star size={14} /> Sabores del Combo</h3>
              {componentesDetectados.map((label) => (
                <div key={label}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Sabor de {label}</label>
                  <select 
                    className="w-full bg-white border-none p-3 text-sm mt-1 outline-none"
                    onChange={(e) => setOpcionesCombo({...opcionesCombo, [label]: e.target.value})}
                  >
                    <option value="">Seleccionar sabor...</option>
                    {saboresDisponibles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* SECCIÓN DE NOTAS CON ACLARACIÓN (LO QUE PEDISTE) */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notas del pedido</label>
              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">
                {isCombo ? "Sabor de Proteína / Creatina" : isBidon ? "Color del Bidón" : "Preferencia de Sabor/Color"}
              </span>
            </div>
            <textarea 
              className="w-full bg-gray-50 border border-gray-100 p-4 text-sm outline-none rounded-sm min-h-[100px] focus:bg-white focus:border-black transition-all"
              placeholder={obtenerAclaracionNotas()}
              onChange={(e) => setNotasExtra(e.target.value)}
            />
            <p className="text-[9px] text-gray-400 mt-2 uppercase leading-relaxed">
              * Si olvidaste seleccionar arriba, podés escribir el <b>sabor de la proteína, color de bidón o sabor de creatina</b> aquí mismo.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 mb-8 shadow-sm rounded-sm">
             <h3 className="text-[11px] font-bold uppercase mb-6 flex items-center gap-2"><Truck size={16}/> Datos de Entrega</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Nombre" className="bg-gray-50 p-4 text-sm outline-none focus:bg-white" onChange={(e) => setEnvio({...envio, nombre: e.target.value})} />
                <input type="text" placeholder="Apellido" className="bg-gray-50 p-4 text-sm outline-none focus:bg-white" onChange={(e) => setEnvio({...envio, apellido: e.target.value})} />
             </div>
             <input type="text" placeholder="Dirección y Altura" className="w-full bg-gray-50 p-4 text-sm outline-none mb-4 focus:bg-white" onChange={(e) => setEnvio({...envio, direccion: e.target.value})} />
             <input type="text" placeholder="Teléfono de contacto" className="w-full bg-gray-50 p-4 text-sm outline-none focus:bg-white" onChange={(e) => setEnvio({...envio, telefono: e.target.value})} />
          </div>

          <button 
            onClick={handleCreatePreference} 
            disabled={creatingPreference}
            className="w-full bg-[#009ee3] text-white font-bold py-5 uppercase text-sm tracking-widest hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
          >
            {creatingPreference ? "Procesando..." : "Finalizar Compra"}
          </button>

          {preferenceId && (
            <div className="mt-6 border-t pt-6 animate-in fade-in duration-500">
              <Wallet initialization={{ preferenceId }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}