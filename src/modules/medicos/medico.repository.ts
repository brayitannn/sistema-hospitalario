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

export class MedicoRepository {
  async findAll(): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .order("apellido", { ascending: true });

    if (error) throw new Error(`Error obteniendo medicos: ${error.message}`);

    return (data || []).map((row) => ({
      medicoId:           row.medicoid,
      nombre:             row.nombre,
      apellido:           row.apellido,
      especialidadId:     row.especialidadid,
      hospitalId:         row.hospitalid,
      telefono:           row.telefono,
      correoElectronico:  row.correoelectronico,
      especialidad: {
        especialidadId: row.especialidades.especialidadid,
        nombre:         row.especialidades.nombre,
      },
      hospital: {
        hospitalId: row.hospitales.hospitalid,
        nombre:     row.hospitales.nombre,
        direccion:  row.hospitales.direccion,
        nit:        "",
        telefono:   "",
      },
    }));
  }

  async findByEspecialidad(especialidadId: number): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .eq("especialidadid", especialidadId)
      .order("apellido");

    if (error) throw new Error(error.message);

    return (data || []).map((row) => this.mapRow(row));
  }

  async create(dto: CreateMedicoDTO): Promise<MedicoConRelaciones> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .insert({
        nombre:           dto.nombre,
        apellido:         dto.apellido,
        especialidadid:   dto.especialidadId,
        hospitalid:       dto.hospitalId,
        telefono:         dto.telefono,
        correoelectronico: dto.correoElectronico,
      })
      .select(MEDICO_SELECT)
      .single();

    if (error) throw new Error(`Error creando medico: ${error.message}`);

    return this.mapRow(data!);
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("medicos").delete().eq("medicoid", id);
    return !error;
  }

  private mapRow(row: Record<string, any>): MedicoConRelaciones {
    return {
      medicoId: row.medicoid, nombre: row.nombre, apellido: row.apellido,
      especialidadId: row.especialidadid, hospitalId: row.hospitalid,
      telefono: row.telefono, correoElectronico: row.correoelectronico,
      especialidad: { especialidadId: row.especialidades.especialidadid,
        nombre: row.especialidades.nombre },
      hospital: { hospitalId: row.hospitales.hospitalid,
        nombre: row.hospitales.nombre, direccion: row.hospitales.direccion,
        nit: "", telefono: "" },
    };
  }
}