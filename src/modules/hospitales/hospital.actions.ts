/**
 * @file src/modules/hospitales/hospital.actions.ts
 * @description Server Actions para operaciones de hospitales.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HospitalRepository } from "./hospital.repository";
import { HospitalService } from "./hospital.service";
import {
  CreateHospitalSchema,
  UpdateHospitalSchema
} from "./hospital.schema";

// Instanciar con inyeccion de dependencias (DIP)
const hospitalRepo    = new HospitalRepository();
const hospitalService = new HospitalService(hospitalRepo);

// Tipo para el estado del form (useActionState)
type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Crea un nuevo hospital desde un formulario HTML.
 */
export async function createHospitalAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  // PASO 1: Extraer datos del FormData
  const rawData = {
    nombre:    formData.get("nombre")    as string,
    direccion: formData.get("direccion") as string,
    nit:       formData.get("nit")       as string,
    telefono:  formData.get("telefono")  as string,
  };

  // PASO 2: Validar con Zod
  const validation = CreateHospitalSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrija los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  // PASO 3: Llamar al servicio con datos validados
  const result = await hospitalService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error ?? "Error desconocido" };
  }

  // PASO 4: Revalidar el cache de la pagina de hospitales
  revalidatePath("/dashboard/hospitales");

  // PASO 5: Redirigir al listado
  redirect("/dashboard/hospitales");
}

/**
 * Elimina un hospital por ID.
 */
export async function deleteHospitalAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID invalido" };
  }

  const result = await hospitalService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error ?? "Error al eliminar" };
  }

  revalidatePath("/dashboard/hospitales");
  return { success: true, message: "Hospital eliminado exitosamente" };
}