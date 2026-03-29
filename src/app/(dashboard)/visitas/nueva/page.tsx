"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Building2, 
  MapPin, 
  Hash, 
  Phone 
} from "lucide-react";
import Link from "next/link";
import { deleteHospitalAction } from "@/modules/hospitales/hospital.actions";
import { toast } from "react-hot-toast";

interface Hospital {
  id: number;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
}

interface HospitalListProps {
  initialData: Hospital[];
}

export function HospitalList({ initialData }: HospitalListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospitales = initialData.filter(
    (h) =>
      h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.nit.includes(searchTerm)
  );

  const handleDelete = async (formData: FormData) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar este hospital?");
    if (!confirmDelete) return;

    const result = await deleteHospitalAction(null, formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o NIT..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          href="/dashboard/hospitales/nuevo"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Hospital
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hospital</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identificación</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHospitales.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{hospital.nombre}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin size={12} />
                          {hospital.direccion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Hash size={14} className="text-gray-400" />
                      <span>NIT: {hospital.nit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      {hospital.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/hospitales/editar/${hospital.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil size={18} />
                      </Link>
                      
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={hospital.id} />
                        <button
                          type="submit"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHospitales.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 text-gray-300 rounded-full mb-4">
              <Building2 size={32} />
            </div>
            <p className="text-gray-500 text-sm">No se encontraron hospitales que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}