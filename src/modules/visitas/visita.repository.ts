/**
 * @file src/modules/visitas/visita.repository.ts
 * @description Repositorio para Visitas con multiples JOINs.
 *
 * La visita tiene relaciones con:
 * - pacientes (PacienteID FK)
 * - medicos (MedicoID FK) -> especialidades -> hospitales
 * - detallesvisitas (VisitaID FK) -> motivosvisitas
 * - signosvitales (VisitaID FK)
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  VisitaCompleta,
  CreateVisitaCompletaDTO
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawRow = Record<string, any>;

const VISITA_COMPLETA_SELECT = `
  visitaid,
  fecha,
  hora,
  pacienteid,
  medicoid,
  pacientes!pacienteid(
    pacienteid, nombre, apellido, telefono, correoelectronico
  ),
  medicos!medicoid(
    medicoid, nombre, apellido, telefono,
    especialidades!especialidadid(nombre),
    hospitales!hospitalid(nombre)
  ),
  detallesvisitas(
    detallevisitaid, diagnostico,
    motivosvisitas!motivovid(descripcion)
  ),
  signosvitales(
    signovitalid, frecuenciacardiaca, presionarterial,
    frecuenciarespiratoria, temperatura, saturacionoxigeno
  )
`;

function mapVisitaCompleta(row: RawRow): VisitaCompleta {
  const paciente = Array.isArray(row.pacientes)
    ? row.pacientes[0]
    : row.pacientes;
  const medico = Array.isArray(row.medicos)
    ? row.medicos[0]
    : row.medicos;
  const detalle = Array.isArray(row.detallesvisitas)
    ? row.detallesvisitas[0]
    : row.detallesvisitas;
  const sv = Array.isArray(row.signosvitales)
    ? row.signosvitales[0]
    : row.signosvitales;
  const especialidad = Array.isArray(medico?.especialidades)
    ? medico?.especialidades[0]
    : medico?.especialidades;
  const hospital = Array.isArray(medico?.hospitales)
    ? medico?.hospitales[0]
    : medico?.hospitales;
  const motivo = Array.isArray(detalle?.motivosvisitas)
    ? detalle?.motivosvisitas[0]
    : detalle?.motivosvisitas;

  return {
    visitaId:   row.visitaid,
    pacienteId: row.pacienteid,
    medicoId:   row.medicoid,
    fecha:      row.fecha,
    hora:       row.hora,
    paciente: {
      nombre:   paciente?.nombre ?? "",
      apellido: paciente?.apellido ?? "",
      telefono: paciente?.telefono ?? "",
    },
    medico: {
      nombre:       medico?.nombre ?? "",
      apellido:     medico?.apellido ?? "",
      especialidad: especialidad?.nombre ?? "",
    },
    detalle: detalle ? {
      detalleVisitaId:   detalle.detallevisitaid,
      visitaId:          row.visitaid,
      motivoId:          detalle.motivovid ?? 0,
      diagnostico:       detalle.diagnostico ?? "",
      motivoDescripcion: motivo?.descripcion ?? "",
    } : undefined,
    signosVitales: sv ? {
      signoVitalId:           sv.signovitalid,
      visitaId:               row.visitaid,
      frecuenciaCardiaca:     sv.frecuenciacardiaca,
      presionArterial:        sv.presionarterial,
      frecuenciaRespiratoria: sv.frecuenciarespiratoria,
      temperatura:            sv.temperatura,
      saturacionOxigeno:      sv.saturacionoxigeno,
    } : undefined,
  } as VisitaCompleta;
}

export class VisitaRepository {
  async findByPaciente(pacienteId: number): Promise<VisitaCompleta[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("visitas")
      .select(VISITA_COMPLETA_SELECT)
      .eq("pacienteid", pacienteId)
      .order("fecha", { ascending: false })
      .order("hora",  { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []) as unknown as VisitaCompleta[];
  }

  async createCompleta(dto: CreateVisitaCompletaDTO): Promise<VisitaCompleta> {
    const supabase = await createServerSupabaseClient();

    // PASO 1: Crear la visita principal
    const { data: visital, error: visitaError } = await supabase
      .from("visitas")
      .insert({
        pacienteid: dto.pacienteId,
        medicoid:   dto.medicoId,
        fecha:      dto.fecha,
        hora:       dto.hora,
      })
      .select("visitaid")
      .single();

    if (visitaError) throw new Error(`Error creando visita: ${visitaError.message}`);

    const visitaId = visital.visitaid as number;

    // PASO 2: Crear el detalle de la visita (si se proporcionaron)
    if (dto.motivoId && dto.diagnostico) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: detalleError } = await (supabase as any)
        .from("detallesvisitas")
        .insert({
          visitaid:    visitaId,
          motivovid:   dto.motivoId,
          diagnostico: dto.diagnostico,
        });

      if (detalleError) {
        console.error("Error creando detalle visita:", detalleError);
      }
    }

    // PASO 3: Crear los signos vitales (si se proporcionaron)
    if (dto.signosVitales) {
      const sv = dto.signosVitales;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: svError } = await (supabase as any)
        .from("signosvitales")
        .insert({
          visitaid:               visitaId,
          frecuenciacardiaca:     sv.frecuenciaCardiaca,
          presionarterial:        sv.presionArterial,
          frecuenciarespiratoria: sv.frecuenciaRespiratoria,
          temperatura:            sv.temperatura,
          saturacionoxigeno:      sv.saturacionOxigeno,
        });

      if (svError) {
        console.error("Error creando signos vitales:", svError);
      }
    }

    // PASO 4: Retornar la visita completa con todas sus relaciones
    const visitaCompleta = await this.findById(visitaId);
    if (!visitaCompleta) throw new Error("Error al recuperar la visita recien creada");

    return visitaCompleta;
  }

  async findById(id: number): Promise<VisitaCompleta | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("visitas")
      .select(VISITA_COMPLETA_SELECT)
      .eq("visitaid", id)
      .single();

    if (error || !data) return null;

    return mapVisitaCompleta(data as RawRow);
  }
}