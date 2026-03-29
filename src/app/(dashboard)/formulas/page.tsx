/**
 * @file src/app/(dashboard)/formulas/page.tsx
 * @description Pagina de listado y gestion de Formulas Medicas
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Formulas" };

export default async function FormulasPage() {
  const supabase = await createServerSupabaseClient();

  const { data: formulas, error } = await supabase
    .from("formulas")
    .select(`
      formulaid,
      fecha,
      tratamientos!tratamientoid(
        tratamientoid,
        visitas!visitaid(
          pacientes!pacienteid(nombre, apellido),
          medicos!medicoid(nombre, apellido)
        )
      ),
        detallesformulas(
        detalleid,
        presentacion,
        posologia,
        periodouso,
        periodicidaduso,
        medicamentos!medicamentoid(nombre, unidades)
        )
    `)
    .order("fecha", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar formulas</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulas Medicas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formulas?.length} {formulas?.length === 1 ? "formula" : "formulas"} registradas
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nueva Formula
        </button>
      </div>

      {/* Lista */}
      {formulas?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay formulas registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Formula" para agregar una.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formulas?.map((formula) => {
            const tratamiento = formula.tratamientos as any;
            const visita = tratamiento?.visitas;
            const detalles = formula.detallesformulas as any[];
            return (
              <div
                key={formula.formulaid}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Header de la formula */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-semibold text-gray-900">
                      Formula #{formula.formulaid}
                    </span>
                    <span className="text-gray-600">
                      Paciente: {visita?.pacientes?.nombre} {visita?.pacientes?.apellido}
                    </span>
                    <span className="text-gray-600">
                      Dr. {visita?.medicos?.nombre} {visita?.medicos?.apellido}
                    </span>
                    <span className="text-gray-500">Fecha: {formula.fecha}</span>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                    Eliminar
                  </button>
                </div>

                {/* Detalles de medicamentos */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Medicamento</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Presentacion</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Posologia</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Periodo</th>
                      <th className="text-left px-6 py-2 text-gray-500 font-medium">Periodicidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detalles?.map((det) => (
                      <tr key={det.detalleid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">
                          {det.medicamentos?.nombre}
                          <span className="text-gray-400 text-xs ml-1">
                            ({det.medicamentos?.unidades})
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{det.presentacion}</td>
                        <td className="px-6 py-3 text-gray-600">{det.posologia}</td>
                        <td className="px-6 py-3 text-gray-600">{det.periodouso}</td>
                        <td className="px-6 py-3 text-gray-600">{det.periodicidaduso}</td>
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