import { z } from "zod";

export const CreateRefuelingSchema = z.object({
  carId: z.string().min(1, "Selecione um veículo"),
  locale: z.string().min(1, "Local é obrigatório"),
  energyType: z.enum(["ELECTRIC", "DIESEL", "GPL", "HYBRID"]),
  timestamp: z.date(),
  totalCost: z.coerce.number().min(0, "Custo não pode ser negativo"),
  paymentMethod: z.string().nullable().optional(),

  // Campos para veículos elétricos
  kWhCharged: z.coerce.number().min(0).nullable().optional(),
  pricePerKWh: z.coerce.number().min(0).nullable().optional(),
  chargingTime: z.coerce.number().min(0).nullable().optional(),

  // Campos para veículos a combustão
  liters: z.coerce.number().min(0).nullable().optional(),
  pricePerLiter: z.coerce.number().min(0).nullable().optional(),

  // Percentuais
  batteryBefore: z.coerce.number().min(0).max(100).nullable().optional(),
  batteryAfter: z.coerce.number().min(0).max(100).nullable().optional(),
  fuelBefore: z.coerce.number().min(0).max(100).nullable().optional(),
  fuelAfter: z.coerce.number().min(0).max(100).nullable().optional(),
});

export const EditRefuelingSchema = z.object({
  refuelingId: z.string(),
  carId: z.string().min(1, "Selecione um veículo").optional(),
  locale: z.string().min(1, "Local é obrigatório").optional(),
  energyType: z.enum(["ELECTRIC", "DIESEL", "GPL", "HYBRID"]).optional(),
  timestamp: z.date().optional(),
  totalCost: z.coerce.number().min(0, "Custo não pode ser negativo").optional(),
  paymentMethod: z.string().nullable().optional(),
  kWhCharged: z.coerce.number().min(0).nullable().optional(),
  pricePerKWh: z.coerce.number().min(0).nullable().optional(),
  chargingTime: z.coerce.number().min(0).nullable().optional(),
  liters: z.coerce.number().min(0).nullable().optional(),
  pricePerLiter: z.coerce.number().min(0).nullable().optional(),
  batteryBefore: z.coerce.number().min(0).max(100).nullable().optional(),
  batteryAfter: z.coerce.number().min(0).max(100).nullable().optional(),
  fuelBefore: z.coerce.number().min(0).max(100).nullable().optional(),
  fuelAfter: z.coerce.number().min(0).max(100).nullable().optional(),
});

export type CreateRefuelingInput = z.infer<typeof CreateRefuelingSchema>;
export type EditRefuelingInput = z.infer<typeof EditRefuelingSchema>;
