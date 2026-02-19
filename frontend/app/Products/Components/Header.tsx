"use client";

import { Search, ShoppingCart, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(!!(token && storedUser));
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0
      );
      setCartCount(totalItems);
    };

    checkLogin();
    updateCartCount();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${query}`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 gap-8">

        {/* Logo */}
        <Link href="/" className="group flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white px-2 py-1 font-black text-xl tracking-tighter transition-transform group-hover:scale-105">
              DAC PRO
            </div>
            <span className="font-light text-xs tracking-[0.3em] uppercase hidden sm:inline text-gray-500">
              Suplementos
            </span>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic group-hover:text-black transition-colors">
            Entrená mejor, Rendí más
          </p>
        </Link>

        {/* Buscador */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-lg items-center relative group"
        >
          <Search className="absolute left-4 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar suplementos, objetivos..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 text-sm text-black placeholder-gray-400 border border-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all"
          />
        </form>

        {/* Acciones */}
        <div className="flex items-center gap-6 text-gray-600">

          {/* Carrito SIEMPRE visible */}
          <Link
            href="/Carrito"
            className={`relative hover:text-black transition-colors ${
              pathname === "/Carrito" ? "text-black" : ""
            }`}
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Usuario opcional */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} strokeWidth={1.5} />
            </button>
          ) : (
            <Link
              href="/Login"
              className={`hover:text-black transition-colors ${
                pathname === "/Login" ? "text-black" : ""
              }`}
              title="Iniciar sesión"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>

      {/* Categorías */}
      <nav className="border-t border-gray-50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center overflow-x-auto max-w-7xl mx-auto px-4 py-3 gap-8 no-scrollbar md:justify-center">
          {Object.entries(Categorias).map(([key, value]) => {
            const href = `/Categorias/${value}`;
            const isActive = pathname === href;

            return (
              <Link
                key={key}
                href={href}
                className={`whitespace-nowrap text-[10px] uppercase tracking-[0.15em] transition-all pb-1 border-b-2 font-bold ${
                  isActive
                    ? "text-black border-black scale-105"
                    : "text-gray-400 border-transparent hover:text-black"
                }`}
              >
                {value.replace("_", " ")}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
