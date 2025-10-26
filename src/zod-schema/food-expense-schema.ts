import { z } from "zod";

export const CreateFoodExpenseSchema = z.object({
  locale: z.string().min(1, "Local é obrigatório"),
  date: z.date(),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
});

export const EditFoodExpenseSchema = z.object({
  expenseId: z.string(),
  locale: z.string().min(1, "Local é obrigatório").optional(),
  date: z.date().optional(),
  amount: z.number().min(0.01, "Valor deve ser maior que zero").optional(),
});

export type CreateFoodExpenseInput = z.infer<typeof CreateFoodExpenseSchema>;
export type EditFoodExpenseInput = z.infer<typeof EditFoodExpenseSchema>;
