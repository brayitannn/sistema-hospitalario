/**
 * @file src/app/(dashboard)/tratamientos/page.tsx
 * @description Pagina de listado y gestion de Tratamientos
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Tratamientos" };

export default async function TratamientosPage() {
  const supabase = await createServerSupabaseClient();

  const { data: tratamientos, error } = await supabase
    .from("tratamientos")
    .select(`
      tratamientoid,
      fechainicio,
      fechafin,
      visitas!visitaid(
        fecha,
        pacientes!pacienteid(nombre, apellido),
        medicos!medicoid(nombre, apellido)
      )
    `)
    .order("fechainicio", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar tratamientos</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tratamientos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tratamientos?.length} {tratamientos?.length === 1 ? "tratamiento" : "tratamientos"} registrados
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nuevo Tratamiento
        </button>
      </div>

      {/* Tabla */}
      {tratamientos?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay tratamientos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Tratamiento" para agregar uno.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">ID</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Paciente</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Medico</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Fecha Visita</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Fecha Inicio</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Fecha Fin</th>
                <th className="text-right px-6 py-3 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tratamientos?.map((trat) => {
                const visita = trat.visitas as any;
                return (
                  <tr key={trat.tratamientoid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{trat.tratamientoid}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {visita?.pacientes?.nombre} {visita?.pacientes?.apellido}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Dr. {visita?.medicos?.nombre} {visita?.medicos?.apellido}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{visita?.fecha}</td>
                    <td className="px-6 py-4 text-gray-600">{trat.fechainicio}</td>
                    <td className="px-6 py-4 text-gray-600">{trat.fechafin ?? "En curso"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}