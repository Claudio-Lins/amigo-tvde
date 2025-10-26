import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin } from "better-auth/plugins/admin";
import { magicLink } from "better-auth/plugins/magic-link";
import { sendTemplatedEmail } from "./email";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      scopes: ["email", "public_profile", "user_friends"],
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, // Uncomment this to require email verification for sign up
    async sendResetPassword({ user, url }) {
      await sendTemplatedEmail({
        to: user.email,
        subject: "🔐 Redefinir sua senha",
        template: "password-reset",
        userName: (user as any).fullName || user.name,
        url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          acceptedTerms: true,
          acceptedTermsAt: new Date(),
        },
      });
      await sendTemplatedEmail({
        to: user.email,
        subject: "✨ Verificar seu email",
        template: "email-verification",
        userName: (user as any).fullName || user.name,
        url,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "facebook"],
      allowDifferentEmails: true,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        await sendTemplatedEmail({
          to: user.email,
          subject: "📧 Confirmar mudança de email",
          template: "email-change",
          userName: (user as any).fullName || user.name,
          url,
          newEmail,
        });
      },
    },
    additionalFields: {
      role: {
        type: ["DRIVER", "MANAGER", "ADMIN"],
        input: false,
      },
      fullName: {
        type: "string",
        input: true,
      },
      banned: {
        type: "boolean",
        input: false,
      },
      banReason: {
        type: "string",
        input: false,
        required: false,
      },
      banExpires: {
        type: "date",
        input: false,
        required: false,
      },
      acceptedTerms: {
        type: "boolean",
        input: true,
      },
      acceptedTermsAt: {
        type: "date",
        input: true,
        required: false,
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendTemplatedEmail({
          to: email,
          subject: "🎯 Seu link mágico chegou!",
          template: "magic-link",
          url,
        });
      },
    }),
    admin({
      defaultRole: "DRIVER",
      adminRoles: ["ADMIN"],
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" || ctx.path === "/reset-password" || ctx.path === "/change-password") {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password is not strong enough",
          });
        }
      }
    }),
  },
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.path.includes("/callback/")) {
      if (ctx.context.newUser) {
        const user = await prisma.user.findUnique({
          where: { id: ctx.context.newUser.id },
        });

        // Sincronizar name com fullName - garantir que fullName sempre tenha um valor
        const updateData: Record<string, unknown> = {
          acceptedTerms: true,
          acceptedTermsAt: new Date(),
        };

        // Se fullName estiver vazio mas name tiver valor, copiar name para fullName
        if (!user?.fullName && user?.name) {
          updateData.fullName = user.name;
        }
        // Se ambos estiverem vazios, usar o email como fallback
        else if (!user?.fullName && !user?.name) {
          updateData.fullName = user?.email || "Usuário";
        }

        await prisma.user.update({
          where: { id: ctx.context.newUser.id },
          data: updateData,
        });
      }
    }
  }),
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
