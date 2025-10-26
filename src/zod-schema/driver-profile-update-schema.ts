import { z } from "zod";

export const UpdateDriverProfileSchema = z.object({
  // Informações Pessoais
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").optional(),
  birthday: z.date().nullable().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  nationality: z.string().nullable().optional(),
  photo: z.string().url("URL inválida").nullable().optional(),

  // Dados Bancários
  bankName: z.string().nullable().optional(),
  iban: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),

  // Endereço
  street: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
});

export type UpdateDriverProfileInput = z.infer<typeof UpdateDriverProfileSchema>;
