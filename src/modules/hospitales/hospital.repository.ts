import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { IRepository, IPaginableRepository, PageResult } from "@/lib/interfaces/repository.interface";
import type { Hospital, CreateHospitalDTO, HospitalFilters } from "./types";

export class HospitalRepository
  implements
    IRepository<Hospital, number, CreateHospitalDTO>,
    IPaginableRepository<Hospital, HospitalFilters>
{

  async findById(id: number): Promise<Hospital | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("hospitales")          
      .select("*")                 
      .eq("hospitalid", id)        
      .single();                  

    if (error || !data) return null;

    return this.mapToDomain(data);
  }

  async findAll(filters?: HospitalFilters): Promise<Hospital[]> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("hospitales")
      .select("*")
      .order("nombre", { ascending: true });

    if (filters?.nombre) {
      query = query.ilike("nombre", `%${filters.nombre}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener hospitales: ${error.message}`);
    }

    return (data || []).map((row) => this.mapToDomain(row));
  }

  async create(hospitalData: CreateHospitalDTO): Promise<Hospital> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("hospitales")
      .insert({
        nombre:    hospitalData.nombre,
        direccion: hospitalData.direccion,
        nit:       hospitalData.nit,
        telefono:  hospitalData.telefono,
      })
      .select()  
      .single();  

    if (error) {
      throw new Error(`Error al crear hospital: ${error.message}`);
    }

    return this.mapToDomain(data!);
  }

  async update(
    id: number,
    updates: Partial<CreateHospitalDTO>
  ): Promise<Hospital | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("hospitales")
      .update(updates)       
      .eq("hospitalid", id)  
      .select()
      .single();

    if (error || !data) return null;

    return this.mapToDomain(data);
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("hospitales")
      .delete()
      .eq("hospitalid", id);

    return !error; 
  }

  async findPaginated(
    page: number,
    pageSize: number,
    filters?: HospitalFilters
  ): Promise<{ data: Hospital[]; count: number }> {
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;  

    let query = supabase
      .from("hospitales")
      .select("*", { count: "exact" })
      .range(from, to)                 
      .order("nombre");

    if (filters?.nombre) {
      query = query.ilike("nombre", `%${filters.nombre}%`);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }

  private mapToDomain(row: Record<string, any>): Hospital {
    return {
      hospitalId: row.hospitalid as number,
      nombre:     row.nombre    as string,
      direccion:  row.direccion as string,
      nit:        row.nit       as string,
      telefono:   row.telefono  as string,
    };
  }
}