import { z } from "zod";

// =========================
// ENUMS
// =========================
export const EarningSourceSchema = z.enum(["UBER", "BOLT", "TOUR", "OTHER"]);
export const PaymentTypeSchema = z.enum(["CASH", "BANK_TRANSFER", "MBWAY", "OTHER"]);

// =========================
// EARNING SCHEMA (corridas individuais)
// =========================
export const EarningSchema = z.object({
  id: z.string().optional(),
  batchId: z.string().nullable().optional(),
  date: z.coerce.date(),
  description: z.string().nullable().optional(),
  amount: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// =========================
// EARNING BATCH SCHEMA (pagamento semanal)
// =========================
export const EarningBatchSchema = z.object({
  id: z.string().optional(),
  driverId: z.string().min(1, "driverId é obrigatório"),
  source: EarningSourceSchema,
  weekStart: z.coerce.date(),
  weekEnd: z.coerce.date(),
  totalAmount: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  paymentDate: z.coerce.date(),
  paymentType: PaymentTypeSchema,
  referenceId: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  earnings: z.array(EarningSchema).optional(),
});

export const CreateEarningSchema = EarningSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const EditEarningSchema = EarningSchema.omit({ createdAt: true, updatedAt: true });
export const CreateEarningBatchSchema = EarningBatchSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const EditEarningBatchSchema = EarningBatchSchema.omit({ createdAt: true, updatedAt: true });

// =========================
// TYPES
// =========================
export type Earning = z.infer<typeof EarningSchema>;
export type EarningBatch = z.infer<typeof EarningBatchSchema>;
export type EarningSource = z.infer<typeof EarningSourceSchema>;
export type PaymentType = z.infer<typeof PaymentTypeSchema>;
