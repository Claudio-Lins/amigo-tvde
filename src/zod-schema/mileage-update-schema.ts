import { z } from "zod";

export const StartMileageSchema = z.object({
  kmInitialDaily: z.coerce.number().min(0, "Quilometragem não pode ser negativa").max(999999, "Quilometragem inválida"),
  kmInitialWeekly: z.coerce
    .number()
    .min(0, "Quilometragem não pode ser negativa")
    .max(999999, "Quilometragem inválida")
    .nullable()
    .optional(),
});

export const FinishMileageSchema = z.object({
  mileageId: z.string(),
  kmFinalDaily: z.coerce.number().min(0, "Quilometragem não pode ser negativa").max(999999, "Quilometragem inválida"),
  kmFinalWeekly: z.coerce
    .number()
    .min(0, "Quilometragem não pode ser negativa")
    .max(999999, "Quilometragem inválida")
    .nullable()
    .optional(),
});

export type StartMileageInput = z.infer<typeof StartMileageSchema>;
export type FinishMileageInput = z.infer<typeof FinishMileageSchema>;
