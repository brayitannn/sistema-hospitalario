import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { VisitaCompleta } from "@/modules/visitas/types";
import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";

export const metadata = { title: "Visitas" };

async function getVisitas(): Promise<VisitaCompleta[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("visitas")
    .select(`
      visitaid, fecha, hora,
      pacientes!pacienteid(nombre, apellido),
      medicos!medicoid(nombre, apellido)
    `)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false });
  return data as unknown as VisitaCompleta[] || [];
}

export default async function VisitasPage() {
  const visitas = await getVisitas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList size={24} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
        </div>
        <Link
          href="/dashboard/visitas/nueva"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nueva Visita
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Medico</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visitas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No hay visitas registradas
                </td>
              </tr>
            ) : (
              visitas.map((v, index) => (
                <tr key={v.visitaId || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {typeof v.paciente === "object"
                      ? `${v.paciente?.apellido}, ${v.paciente?.nombre}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {typeof v.medico === "object"
                      ? `Dr. ${v.medico?.nombre} ${v.medico?.apellido}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{v.fecha}</td>
                  <td className="px-6 py-4 text-gray-600">{v.hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}