"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Visita {
  visitaid: number;
  fecha: string;
  hora: string;
  paciente?: { nombre: string; apellido: string };
  medico?: { nombre: string; apellido: string };
}

interface Props {
  initialVisitas: Visita[];
}

export function RealtimeVisitasDashboard({ initialVisitas }: Props) {
  const [visitas, setVisitas] = useState<Visita[]>(initialVisitas);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel("dashboard-visitas")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "visitas",
        },
        (payload) => {
          console.log("Nueva visita registrada:", payload.new);
          setVisitas((prev) => [
            payload.new as Visita,
            ...prev.slice(0, 9),
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "visitas",
        },
        (payload) => {
          setVisitas((prev) =>
            prev.filter((v) => v.visitaid !== payload.old.visitaid)
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Visitas Recientes
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "En tiempo real" : "Conectando..."}
          </span>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {visitas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No hay visitas registradas hoy
          </p>
        ) : (
          visitas.map((visita, index) => (
            <div
              key={visita.visitaid ?? index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {typeof visita.paciente === "object"
                    ? `${visita.paciente?.nombre} ${visita.paciente?.apellido}`
                    : "Cargando..."}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dr.{" "}
                  {typeof visita.medico === "object"
                    ? `${visita.medico?.nombre} ${visita.medico?.apellido}`
                    : "..."}
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {visita.fecha}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}