import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Hospital } from "@/modules/hospitales/types";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

export const metadata = { title: "Hospitales" };

async function getHospitales(): Promise<Hospital[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("hospitales")
    .select("*")
    .order("nombre", { ascending: true });

  return (data || []).map((h) => ({
    hospitalId: h.hospitalid,
    nombre: h.nombre,
    nit: h.nit,
    direccion: h.direccion,
    telefono: h.telefono,
  }));
}

export default async function HospitalesPage() {
  const hospitales = await getHospitales();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={24} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Hospitales</h1>
        </div>
        <Link
          href="/dashboard/hospitales/nuevo"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nuevo Hospital
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">NIT</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hospitales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No hay hospitales registrados
                </td>
              </tr>
            ) : (
              hospitales.map((h) => (
                <tr key={h.hospitalId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{h.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{h.nit}</td>
                  <td className="px-6 py-4 text-gray-600">{h.direccion}</td>
                  <td className="px-6 py-4 text-gray-600">{h.telefono}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}