import { z } from "zod";

export const CarTypeEnum = z.enum(["ELECTRIC", "DIESEL", "GPL", "HYBRID"]);

export const CarSchema = z.object({
  id: z.string().cuid(),
  driverId: z.string().optional().nullable(),

  // Relação com DriverProfile (opcional se estiver apenas lendo)
  driver: z.any().optional(),

  // Detalhes do carro
  brand: z.string(),
  model: z.string(),
  type: CarTypeEnum,
  year: z.number().int().optional().nullable(),
  tag: z.string().optional().nullable(),
  image: z.string().optional().nullable(),

  // Finanças
  rentPrice: z.number().optional().nullable(),

  // Relações
  energyLogs: z.array(z.any()).optional(),

  // Metadados
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateCarSchema = CarSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  energyLogs: true,
});

export const UpdateCarSchema = CarSchema.omit({
  createdAt: true,
  updatedAt: true,
  energyLogs: true,
  driver: true,
})
  .partial()
  .extend({
    id: z.string().cuid(),
  });

export type Car = z.infer<typeof CarSchema>;
export type CreateCarInput = z.infer<typeof CreateCarSchema>;
export type UpdateCarInput = z.infer<typeof UpdateCarSchema>;
