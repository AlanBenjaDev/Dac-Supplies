"use client";

import { Search, ShoppingCart, LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export enum Categorias {
  Proteinas = "proteinas",
  Creatinas = "creatinas",
  Colagenos = "colagenos",
  Aminoacidos = "aminoacidos",
  Vitaminas = "vitaminas",
  Minerales = "minerales",
  Pre_entrenos = "pre_entrenos",
  Ganadores_peso = "ganadores_peso",
  Salud_bienestar = "salud_bienestar",
  Quemadores_grasa = "quemadores_grasa",
  Otros = "otros",
}

export default function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(!!(token && storedUser));
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${query}`;
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 gap-8">
        
        {/* Branding DAC PRO con Eslogan */}
        <Link href="/" className="group flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white px-2 py-1 font-black text-xl tracking-tighter transition-transform group-hover:scale-105">
                DAC PRO
            </div>
            <span className="font-light text-xs tracking-[0.3em] uppercase hidden sm:inline text-gray-500">
                Suplementos
            </span>
          </div>
          {/* Eslogan solicitado */}
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic group-hover:text-black transition-colors">
            Entrená mejor, Rendí más
          </p>
        </Link>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-lg items-center relative group">
          <Search className="absolute left-4 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar suplementos, objetivos..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 text-sm text-black placeholder-gray-400 border border-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all"
          />
        </form>

        {/* Acciones de Usuario */}
        <div className="flex items-center gap-6 text-gray-600">
          {isLoggedIn ? (
            <div className="flex items-center gap-5">
              <Link href="/Carrito" className="relative hover:text-black transition-colors">
                <ShoppingCart size={22} strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">2</span>
              </Link>
              <button onClick={handleLogout} className="hover:text-red-500 transition-colors">
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/Login" className="text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors">
                Login
              </Link>
              <Link
                href="/Register"
                className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
              >
                Sumarme
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Nav de Categorías */}
      <nav className="border-t border-gray-50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center overflow-x-auto max-w-7xl mx-auto px-4 py-3 gap-8 no-scrollbar md:justify-center">
          {Object.entries(Categorias).map(([key, value]) => (
            <Link
              key={key}
              href={`/Categorias/${value}`}
              className="whitespace-nowrap text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold hover:text-black transition-all pb-1 border-b border-transparent hover:border-black"
            >
              {value.replace("_", " ")}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
