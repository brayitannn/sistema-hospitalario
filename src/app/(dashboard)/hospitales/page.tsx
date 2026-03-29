"use client";

import { usePathname } from "next/navigation";
import { User, Bell, Search, ChevronDown } from "lucide-react";

interface DashHeaderProps {
  userEmail?: string | null;
}

export function DashHeader({ userEmail }: DashHeaderProps) {
  const pathname = usePathname();

  // Convertir el pathname en un titulo legible
  // Ejemplo: /dashboard/hospitales -> Hospitales
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Panel Principal";
    const segment = pathname.split("/").pop();
    if (!segment) return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      {/* Lado izquierdo: Buscador y Titulo */}
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-semibold text-gray-800 border-r pr-8 border-gray-100">
          {getPageTitle()}
        </h2>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
      </div>

      {/* Lado derecho: Notificaciones y Perfil */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-lg transition-colors group">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-medium text-gray-700 leading-none">
              Usuario Activo
            </span>
            <span className="text-[10px] text-gray-400 mt-1">
              {userEmail || "usuario@sena.edu.co"}
            </span>
          </div>
          
          <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center border border-green-200">
            <User size={20} />
          </div>
          
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </header>
  );
}