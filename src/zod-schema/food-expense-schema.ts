import { z } from "zod";

export const FoodExpenseSchema = z.object({
  id: z.string().cuid(),
  driverId: z.string(),

  // Relação com DriverProfile (substituir por DriverProfileSchema quando disponível)
  driver: z.any().optional(),

  // Detalhes da despesa
  locale: z.string().min(1, "O local é obrigatório"),
  date: z.date(),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val), "Valor inválido"),

  // Metadados
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateFoodExpenseSchema = FoodExpenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  driver: true,
});

export const UpdateFoodExpenseSchema = FoodExpenseSchema.partial().extend({
  id: z.string().cuid(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  driver: z.any().optional(),
});

export type FoodExpense = z.infer<typeof FoodExpenseSchema>;
export type CreateFoodExpenseInput = z.infer<typeof CreateFoodExpenseSchema>;
export type UpdateFoodExpenseInput = z.infer<typeof UpdateFoodExpenseSchema>;
