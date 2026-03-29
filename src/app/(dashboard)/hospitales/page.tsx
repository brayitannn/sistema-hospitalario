import { HospitalRepository } from "@/modules/hospitales/hospital.repository";
import { HospitalService } from "@/modules/hospitales/hospital.service";

export const metadata = { title: "Hospitales" };

const hospitalService = new HospitalService(new HospitalRepository());

export default async function HospitalesPage() {
  const result = await hospitalService.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar hospitales</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const hospitales = result.data ?? [];

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospitales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hospitales.length} hospital{hospitales.length !== 1 ? "es" : ""} registrados
          </p>
        </div>
      </div>

      {/* Tabla o vacío */}
      {hospitales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay hospitales registrados</p>
          <p className="text-sm mt-1">Agrega el primero usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">NIT</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Dirección</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hospitales.map((hospital) => (
                <tr key={hospital.hospitalId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{hospital.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{hospital.nit}</td>
                  <td className="px-4 py-3 text-gray-600">{hospital.direccion}</td>
                  <td className="px-4 py-3 text-gray-600">{hospital.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}