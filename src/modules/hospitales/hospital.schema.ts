/**
 * @file src/modules/hospitales/hospital.schema.ts
 *
 * @description Schemas de validacion Zod para Hospitales.
 *
 * Zod valida en TIEMPO DE EJECUCION (a diferencia de TypeScript
 * que valida en tiempo de compilacion). Esto es crucial para
 * datos que vienen del usuario (formularios, APIs externas).
 *
 * @see https://zod.dev
 */

import { z } from "zod";

/**
 * Schema para crear un hospital.
 * Define reglas de validacion para cada campo.
 */
export const CreateHospitalSchema = z.object({
  nombre: z
    .string({ error: "El nombre es obligatorio" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),

  direccion: z
    .string({ error: "La direccion es obligatoria" })
    .min(10, "La direccion debe tener al menos 10 caracteres")
    .max(200),

  nit: z
    .string({ error: "El NIT es obligatorio" })
    // Formato NIT colombiano: 800123456-7 o 80012345-7
    .regex(
      /^\d{8,9}-\d$/,
      "NIT invalido. Formato esperado: 800123456-7"
    ),

  telefono: z
    .string({ error: "El telefono es obligatorio" })
    // Solo digitos, entre 7 y 10 caracteres
    .regex(/^[0-9]{7,10}$/, "Telefono invalido. Solo digitos, 7-10 caracteres"),
});

// Schema para actualizar: todos los campos opcionales
export const UpdateHospitalSchema = CreateHospitalSchema.partial();

// Tipos inferidos automaticamente por Zod
export type CreateHospitalInput = z.infer<typeof CreateHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof UpdateHospitalSchema>;