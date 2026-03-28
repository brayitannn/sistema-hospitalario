import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Formula, CreateFormulaDTO } from "./types";

export class FormulaRepository {
  async findByTratamiento(tratamientoId: number): Promise<Formula[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("formulas")
      .select(`
        formulaid, fecha,
        tratamientoid,
        detallesformulas(
          detalleid,
          presentacion,
          posologia,
          periodouso,
          periodicidaduso,
          medicamentos!medicamentoid(
            medicamentoid, nombre, prescripcion, unidades, descripcion
          )
        )
      `)
      .eq("tratamientoid", tratamientoId)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((f: any) => ({
      formulaId:     f.formulaid,
      tratamientoId: f.tratamientoid,
      fecha:         f.fecha,
      detalles: (f.detallesformulas || []).map((d: any) => ({
        detalleId:       d.detalleid,
        presentacion:    d.presentacion,
        posologia:       d.posologia,
        periodoUso:      d.periodouso,
        periodicidadUso: d.periodicidaduso,
        medicamento: {
          medicamentoId: d.medicamentos?.medicamentoid,
          nombre:        d.medicamentos?.nombre,
          prescripcion:  d.medicamentos?.prescripcion,
          unidades:      d.medicamentos?.unidades,
          descripcion:   d.medicamentos?.descripcion,
          cantidad:      0,
        },
      })),
    }));
  }

  async createConDetalles(dto: CreateFormulaDTO): Promise<Formula> {
    const supabase = await createServerSupabaseClient();

    const { data: formula, error: fErr } = await supabase
      .from("formulas")
      .insert({
        tratamientoid: dto.tratamientoId,
        fecha:         dto.fecha,
      })
      .select("formulaid")
      .single();

    if (fErr) throw new Error(fErr.message);

    if (dto.detalles && dto.detalles.length > 0) {
      const detallesInsert = dto.detalles.map((d) => ({
        formulaid:       formula!.formulaid,
        medicamentoid:   d.medicamentoId,
        presentacion:    d.presentacion,
        posologia:       d.posologia,
        periodouso:      d.periodoUso,
        periodicidaduso: d.periodicidadUso,
      }));

      const { error: dErr } = await supabase
        .from("detallesformulas")
        .insert(detallesInsert);

      if (dErr) throw new Error(`Error en detalles formula: ${dErr.message}`);
    }

    const formulas = await this.findByTratamiento(dto.tratamientoId);
    return formulas.find((f) => f.formulaId === formula!.formulaid)!;
  }
}