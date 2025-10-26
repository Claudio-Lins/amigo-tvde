import { z } from "zod";

// Enum alinhado ao Prisma
export const EnergyTypeEnum = z.enum(["ELECTRIC", "DIESEL", "GPL", "HYBRID"]);

export const EnergyLogSchema = z.object({
  id: z.string().cuid(),

  // Relações
  driverId: z.string(),
  driver: z.any().optional(), // substitui depois por DriverProfileSchema
  carId: z.string().nullable().optional(),
  car: z.any().optional(), // substitui depois por CarSchema

  // Dados gerais
  locale: z.string().min(1, "O local é obrigatório"), // Ex: Lidl, Ionity
  energyType: EnergyTypeEnum,
  timestamp: z.date(),

  totalCost: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !Number.isNaN(val), "Valor inválido"),

  paymentMethod: z.string().nullable().optional(),

  // Campos para elétricos
  kWhCharged: z.number().int().optional().nullable(),
  pricePerKWh: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val == null ? null : typeof val === "string" ? parseFloat(val) : val)),
  chargingTime: z.number().int().optional().nullable(), // em minutos

  // Campos para combustão
  liters: z.number().int().optional().nullable(),
  pricePerLiter: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val == null ? null : typeof val === "string" ? parseFloat(val) : val)),

  // Percentuais
  batteryBefore: z.number().min(0).max(100).optional().nullable(),
  batteryAfter: z.number().min(0).max(100).optional().nullable(),
  fuelBefore: z.number().min(0).max(100).optional().nullable(),
  fuelAfter: z.number().min(0).max(100).optional().nullable(),

  // Metadados
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateEnergyLogSchema = EnergyLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  driver: true,
  car: true,
});

export const UpdateEnergyLogSchema = EnergyLogSchema.partial().extend({
  id: z.string().cuid(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  driver: z.any().optional(),
  car: z.any().optional(),
});

export type EnergyLog = z.infer<typeof EnergyLogSchema>;
export type CreateEnergyLogInput = z.infer<typeof CreateEnergyLogSchema>;
export type UpdateEnergyLogInput = z.infer<typeof UpdateEnergyLogSchema>;
