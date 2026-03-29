import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Medico } from "@/modules/medicos/types";
import Link from "next/link";
import { UserRound, Plus } from "lucide-react";

export const metadata = { title: "Medicos" };

async function getMedicos(): Promise<Medico[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("medicos")
    .select("*")
    .order("apellido", { ascending: true });
  
  return (data || []).map((m) => ({
    medicoId: m.medicoid,
    nombre: m.nombre,
    apellido: m.apellido,
    especialidadId: m.especialidadid,
    hospitalId: m.hospitalid,
    telefono: m.telefono,
    correoElectronico: m.correoelectronico,
  }));
}

export default async function MedicosPage() {
  const medicos = await getMedicos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserRound size={24} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Medicos</h1>
        </div>
        <Link
          href="/dashboard/medicos/nuevo"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nuevo Medico
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Especialidad</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hospital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {medicos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No hay medicos registrados
                </td>
              </tr>
            ) : (
              medicos.map((m) => (
                <tr key={m.medicoId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {m.apellido}, {m.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{m.telefono}</td>
                  <td className="px-6 py-4 text-gray-600">{m.correoElectronico}</td>
                  <td className="px-6 py-4 text-gray-600">{m.especialidadId}</td>
                  <td className="px-6 py-4 text-gray-600">{m.hospitalId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}