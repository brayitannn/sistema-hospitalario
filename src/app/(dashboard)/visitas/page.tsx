/**
 * @file src/app/(dashboard)/visitas/page.tsx
 * @description Pagina de listado y gestion de Visitas
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Visitas" };

export default async function VisitasPage() {
  const supabase = await createServerSupabaseClient();

  const { data: visitas, error } = await supabase
    .from("visitas")
    .select(`
      visitaid,
      fecha,
      hora,
      pacientes!pacienteid(nombre, apellido),
      medicos!medicoid(nombre, apellido)
    `)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar visitas</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {visitas?.length} {visitas?.length === 1 ? "visita" : "visitas"} registradas
          </p>
        </div>
        <Link
          href="/visitas/nueva"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Visita
        </Link>
      </div>

      {/* Tabla */}
      {visitas?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay visitas registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Visita" para registrar una.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">ID</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Paciente</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Medico</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Fecha</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Hora</th>
                <th className="text-right px-6 py-3 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitas?.map((vis) => (
                <tr key={vis.visitaid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{vis.visitaid}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {(vis.pacientes as any)?.nombre} {(vis.pacientes as any)?.apellido}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    Dr. {(vis.medicos as any)?.nombre} {(vis.medicos as any)?.apellido}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{vis.fecha}</td>
                  <td className="px-6 py-4 text-gray-600">{vis.hora}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}