/**
 * @file src/modules/formulas/formula.repository.ts
 * @description Repositorio para Formulas (recetas medicas).
 *
 * Relacion: Tratamientos -> Formulas -> DetallesFormulas -> Medicamentos
 *
 * SQL equivalente:
 * SELECT f.*, df.*, m.*
 * FROM formulas f
 * JOIN detallesformulas df ON f.formulaid = df.formulaid
 * JOIN medicamentos m ON df.medicamentoid = m.medicamentoid
 * WHERE f.tratamientoid = :tratamientoid
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Formula, CreateFormulaDTO } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawRow = Record<string, any>;

export class FormulaRepository {
  /**
   * Obtiene todas las formulas de un tratamiento.
   * Incluye los medicamentos recetados en cada formula.
   */
  async findByTratamiento(tratamientoId: number): Promise<Formula[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("formulas")
      .select(`
        formulaid,
        fecha,
        tratamientoid,
        detallesformulas(
          detalleid,
          presentacion,
          posologia,
          periodouse,
          periodicidaduso,
          medicamentos!medicamentoid(
            medicamentoid, nombre, prescripcion, unidades, descripcion
          )
        )
      `)
      .eq("tratamientoid", tratamientoId)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((f) => ({
      formulaId:      f.formulaid,
      tratamientoId:  f.tratamientoid,
      fecha:          f.fecha,
      detalles: (f.detallesformulas || []).map((d: RawRow) => {
        const med = Array.isArray(d.medicamentos)
          ? d.medicamentos[0]
          : d.medicamentos;
        return {
          detalleId:        d.detalleid as number,
          presentacion:     d.presentacion as string,
          posologia:        d.posologia as string,
          periodoUso:       d.periodouse as string,
          periodicidadUso:  d.periodicidaduso as string,
          medicamento: {
            medicamentoId: med?.medicamentoid ?? 0,
            nombre:        med?.nombre ?? "",
            prescripcion:  med?.prescripcion ?? "",
            unidades:      med?.unidades ?? "",
            descripcion:   med?.descripcion ?? "",
            cantidad:      0,
          },
        };
      }),
    }));
  }

  /**
   * Crea una formula con todos sus detalles (medicamentos recetados).
   * Patron maestro-detalle:
   * 1. Insertar la formula (maestro)
   * 2. Insertar N detalles referenciando la formula
   */
  async createConDetalles(dto: CreateFormulaDTO): Promise<Formula> {
    const supabase = await createServerSupabaseClient();

    // 1. Crear la formula
    const { data: formula, error: fErr } = await supabase
      .from("formulas")
      .insert({
        tratamientoid: dto.tratamientoId,
        fecha:         dto.fecha,
      })
      .select("formulaid")
      .single();

    if (fErr) throw new Error(fErr.message);

    const formulaId = formula.formulaid as number;

    // 2. Crear los detalles (medicamentos) si los hay
    if (dto.detalles && dto.detalles.length > 0) {
      const detallesInsert = dto.detalles.map((d) => ({
        formulaid:       formulaId,
        medicamentoid:   d.medicamentoId,
        presentacion:    d.presentacion,
        posologia:       d.posologia,
        periodouse:      d.periodoUso,
        periodicidaduso: d.periodicidadUso,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dErr } = await (supabase as any)
        .from("detallesformulas")
        .insert(detallesInsert);

      if (dErr) throw new Error(`Error en detalles formula: ${dErr.message}`);
    }

    // 3. Retornar la formula completa
    const formulas = await this.findByTratamiento(dto.tratamientoId);
    const resultado = formulas.find((f) => f.formulaId === formulaId);
    if (!resultado) throw new Error("Error al recuperar la formula recien creada");

    return resultado;
  }
}