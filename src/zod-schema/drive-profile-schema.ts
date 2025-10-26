import { z } from "zod";
import { CarSchema } from "./car-schema";
import { EnergyLogSchema } from "./energy-log-schema";

import { CreateFoodExpenseSchema } from "./food-expense-schema";
import { MileageSchema } from "./mileage-schema";
import { UserSchema } from "./user-schema";

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const DriverProfileSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  user: UserSchema.optional(),

  // Identificação
  firstName: z.string(),
  lastName: z.string(),

  // Dados pessoais
  birthday: z.date().optional().nullable(),
  gender: GenderEnum.optional().nullable(),
  nationality: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),

  // Conta bancária
  bankName: z.string().optional().nullable(),
  iban: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),

  // Endereço
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),

  // Datas
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),

  // Relacionamentos opcionais
  cars: z.array(CarSchema).optional(),
  mileage: z.array(MileageSchema).optional(),
  foodExpenses: z.array(CreateFoodExpenseSchema).optional(),
  energyLogs: z.array(EnergyLogSchema).optional(),
});

export const CreateDriverProfileSchema = DriverProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  cars: true,
  mileage: true,
  foodExpenses: true,
  energyLogs: true,
});

export const UpdateDriverProfileSchema = DriverProfileSchema.partial().extend({
  id: z.string().cuid(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  cars: z.array(CarSchema).optional(),
  mileage: z.array(MileageSchema).optional(),
  foodExpenses: z.array(CreateFoodExpenseSchema).optional(),
  energyLogs: z.array(EnergyLogSchema).optional(),
});

export const DriverProfileRelations = z.object({
  user: UserSchema.optional().nullable(),
  cars: z.array(CarSchema).optional().nullable(),
  mileage: z.array(MileageSchema).optional().nullable(),
  foodExpenses: z.array(CreateFoodExpenseSchema).optional().nullable(),
  energyLogs: z.array(EnergyLogSchema).optional().nullable(),
});

export type DriverProfile = z.infer<typeof DriverProfileSchema>;
export type CreateDriverProfileInput = z.infer<typeof CreateDriverProfileSchema>;
export type UpdateDriverProfileInput = z.infer<typeof UpdateDriverProfileSchema>;
export type DriverProfileRelations = z.infer<typeof DriverProfileRelations>;
