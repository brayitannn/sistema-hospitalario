/**
 * @file src/app/(dashboard)/examenes/page.tsx
 * @description Pagina de listado y gestion de Examenes
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Examenes" };

export default async function ExamenesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: examenes, error } = await supabase
    .from("orden_examenes")
    .select(`
      ordenexamenid,
      fecha,
      visitas!visitaid(
        fecha,
        pacientes!pacienteid(nombre, apellido),
        medicos!medicoid(nombre, apellido)
      ),
      detallesexamenes(
        detalleexamenid,
        tipoexamen,
        nombreexamen,
        indicaciones
      )
    `)
    .order("fecha", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar examenes</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Examenes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {examenes?.length} {examenes?.length === 1 ? "orden" : "ordenes"} registradas
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nueva Orden
        </button>
      </div>

      {/* Tabla */}
      {examenes?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay examenes registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Orden" para agregar uno.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {examenes?.map((orden) => {
            const visita = orden.visitas as any;
            const detalles = orden.detallesexamenes as any[];
            return (
              <div
                key={orden.ordenexamenid}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Header de la orden */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-semibold text-gray-900">
                      Orden #{orden.ordenexamenid}
                    </span>
                    <span className="text-gray-600">
                      Paciente: {visita?.pacientes?.nombre} {visita?.pacientes?.apellido}
                    </span>
                    <span className="text-gray-600">
                      Dr. {visita?.medicos?.nombre} {visita?.medicos?.apellido}
                    </span>
                    <span className="text-gray-500">Fecha: {orden.fecha}</span>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                    Eliminar
                  </button>
                </div>

                {/* Detalles de examenes */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Tipo</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Nombre</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Indicaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detalles?.map((det) => (
                      <tr key={det.detalleexamenid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-600">{det.tipoexamen}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{det.nombreexamen}</td>
                        <td className="px-6 py-3 text-gray-500">{det.indicaciones ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}