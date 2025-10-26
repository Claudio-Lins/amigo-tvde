import { z } from "zod";

export const MileageSchema = z.object({
  id: z.string().cuid(),
  driverId: z.string(),

  // Relação com DriverProfile (pode ser substituída por um schema quando existir)
  driver: z.any().optional(),

  // Quilometragem diária e semanal
  kmInitialDaily: z.number().int().optional().nullable(),
  kmFinalDaily: z.number().int().optional().nullable(),
  kmInitialWeekly: z.number().int().optional().nullable(),
  kmFinalWeekly: z.number().int().optional().nullable(),

  // Metadados
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateMileageSchema = MileageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  driver: true,
});

export const UpdateMileageSchema = MileageSchema.partial().extend({
  id: z.string().cuid(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  driver: z.any().optional(),
});

export type Mileage = z.infer<typeof MileageSchema>;
export type CreateMileageInput = z.infer<typeof CreateMileageSchema>;
export type UpdateMileageInput = z.infer<typeof UpdateMileageSchema>;
