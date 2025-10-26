import { z } from "zod";

// Enum correspondente ao Prisma Enum UserRole
export const UserRoleEnum = z.enum(["ADMIN", "MANAGER", "DRIVER"]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().url().nullable().optional(),
  role: UserRoleEnum.default("DRIVER"),
  banned: z.boolean().default(false),
  banReason: z.string().nullable().optional(),
  banExpires: z.date().nullable().optional(),
  acceptedTerms: z.boolean().default(false),
  acceptedTermsAt: z.date().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),

  // Relacionamentos (geralmente opcionais no schema de validação)
  sessions: z.array(z.any()).optional(),
  accounts: z.array(z.any()).optional(),
  driverProfile: z.any().nullable().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sessions: true,
  accounts: true,
  driverProfile: true,
}).extend({
  emailVerified: z.boolean().optional(),
  acceptedTerms: z.boolean().default(true),
  acceptedTermsAt: z.date().default(() => new Date()),
});

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sessions: true,
  accounts: true,
  driverProfile: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
