/**
 * @file src/app/(dashboard)/medicamentos/page.tsx
 * @description Pagina de listado y gestion de Medicamentos
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Medicamentos" };

export default async function MedicamentosPage() {
  const supabase = await createServerSupabaseClient();

  const { data: medicamentos, error } = await supabase
    .from("medicamentos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar medicamentos</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicamentos?.length} {medicamentos?.length === 1 ? "medicamento" : "medicamentos"} registrados
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nuevo Medicamento
        </button>
      </div>

      {/* Tabla */}
      {medicamentos?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay medicamentos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Medicamento" para agregar uno.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Nombre</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Prescripcion</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Cantidad</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Unidades</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Descripcion</th>
                <th className="text-right px-6 py-3 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medicamentos?.map((med) => (
                <tr key={med.medicamentoid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{med.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{med.prescripcion}</td>
                  <td className="px-6 py-4 text-gray-600">{med.cantidad}</td>
                  <td className="px-6 py-4 text-gray-600">{med.unidades}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{med.descripcion ?? "—"}</td>
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