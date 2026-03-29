/**
 * @file src/modules/medicos/medico.repository.ts
 * @description Repositorio para Medicos con relaciones.
 * Implementa JOINs usando la sintaxis de Supabase PostgREST.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  MedicoConRelaciones,
  CreateMedicoDTO
} from "./types";

const MEDICO_SELECT = `
  medicoid,
  nombre,
  apellido,
  especialidadid,
  hospitalid,
  telefono,
  correoelectronico,
  especialidades!especialidadid(especialidadid, nombre),
  hospitales!hospitalid(hospitalid, nombre, direccion)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawMedicoRow = Record<string, any>;

function mapRow(row: RawMedicoRow): MedicoConRelaciones {
  const esp = Array.isArray(row.especialidades)
    ? row.especialidades[0]
    : row.especialidades;
  const hosp = Array.isArray(row.hospitales)
    ? row.hospitales[0]
    : row.hospitales;

  return {
    medicoId:          row.medicoid,
    nombre:            row.nombre,
    apellido:          row.apellido,
    especialidadId:    row.especialidadid,
    hospitalId:        row.hospitalid,
    telefono:          row.telefono,
    correoElectronico: row.correoelectronico,
    especialidad: {
      especialidadId: esp?.especialidadid ?? 0,
      nombre:         esp?.nombre ?? "",
    },
    hospital: {
      hospitalId: hosp?.hospitalid ?? 0,
      nombre:     hosp?.nombre ?? "",
      direccion:  hosp?.direccion ?? "",
      nit:        "",
      telefono:   "",
    },
  };
}

export class MedicoRepository {
  async findAll(): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .order("apellido", { ascending: true });

    if (error) throw new Error(`Error obteniendo medicos: ${error.message}`);

    return (data || []).map((row) => mapRow(row as RawMedicoRow));
  }

  async findByEspecialidad(especialidadId: number): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .eq("especialidadid", especialidadId)
      .order("apellido");

    if (error) throw new Error(error.message);

    return (data || []).map((row) => mapRow(row as RawMedicoRow));
  }

  async create(dto: CreateMedicoDTO): Promise<MedicoConRelaciones> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .insert({
        nombre:            dto.nombre,
        apellido:          dto.apellido,
        especialidadid:    dto.especialidadId,
        hospitalid:        dto.hospitalId,
        telefono:          dto.telefono,
        correoelectronico: dto.correoElectronico,
      })
      .select(MEDICO_SELECT)
      .single();

    if (error) throw new Error(`Error creando medico: ${error.message}`);

    return mapRow(data as RawMedicoRow);
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("medicos")
      .delete()
      .eq("medicoid", id);
    return !error;
  }
}