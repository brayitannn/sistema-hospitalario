/**
 * @file src/app/(dashboard)/pacientes/page.tsx
 * @description Pagina de listado y gestion de Pacientes
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Pacientes" };

export default async function PacientesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: pacientes, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("apellido", { ascending: true });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar pacientes</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pacientes?.length} {pacientes?.length === 1 ? "paciente" : "pacientes"} registrados
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nuevo Paciente
        </button>
      </div>

      {/* Tabla */}
      {pacientes?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay pacientes registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Paciente" para agregar uno.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Nombre</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Fecha Nacimiento</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Sexo</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Telefono</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Correo</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Direccion</th>
                <th className="text-right px-6 py-3 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientes?.map((pac) => (
                <tr key={pac.pacienteid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pac.nombre} {pac.apellido}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pac.fechanacimiento}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pac.sexo === "M"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-pink-50 text-pink-700"
                    }`}>
                      {pac.sexo === "M" ? "Masculino" : "Femenino"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pac.telefono}</td>
                  <td className="px-6 py-4 text-gray-500">{pac.correoelectronico}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{pac.direccion}</td>
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