/**
 * @file src/app/(dashboard)/incapacidades/page.tsx
 * @description Pagina de listado y gestion de Incapacidades
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Incapacidades" };

export default async function IncapacidadesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: incapacidades, error } = await supabase
    .from("incapacidades")
    .select(`
      incapacidadid,
      fecha,
      tratamientos!tratamientoid(
        tratamientoid,
        visitas!visitaid(
          pacientes!pacienteid(nombre, apellido),
          medicos!medicoid(nombre, apellido)
        )
      ),
      detallesincapacidades(
        detalleid,
        descripcion,
        numerodias,
        fechainicio,
        fechafin
      )
    `)
    .order("fecha", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar incapacidades</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incapacidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            {incapacidades?.length} {incapacidades?.length === 1 ? "incapacidad" : "incapacidades"} registradas
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nueva Incapacidad
        </button>
      </div>

      {/* Lista */}
      {incapacidades?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay incapacidades registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Incapacidad" para agregar una.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incapacidades?.map((inc) => {
            const tratamiento = inc.tratamientos as any;
            const visita = tratamiento?.visitas;
            const detalles = inc.detallesincapacidades as any[];
            return (
              <div
                key={inc.incapacidadid}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Header de la incapacidad */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-semibold text-gray-900">
                      Incapacidad #{inc.incapacidadid}
                    </span>
                    <span className="text-gray-600">
                      Paciente: {visita?.pacientes?.nombre} {visita?.pacientes?.apellido}
                    </span>
                    <span className="text-gray-600">
                      Dr. {visita?.medicos?.nombre} {visita?.medicos?.apellido}
                    </span>
                    <span className="text-gray-500">Fecha: {inc.fecha}</span>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                    Eliminar
                  </button>
                </div>

                {/* Detalles de la incapacidad */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Descripcion</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Numero de Dias</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Fecha Inicio</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Fecha Fin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detalles?.map((det) => (
                      <tr key={det.detalleid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-900 font-medium">{det.descripcion}</td>
                        <td className="px-6 py-3 text-gray-600">
                          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            {det.numerodias} días
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{det.fechainicio}</td>
                        <td className="px-6 py-3 text-gray-600">{det.fechafin}</td>
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