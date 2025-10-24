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
        userName: user.name,
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
        userName: user.name,
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
          userName: user.name,
          url,
          newEmail,
        });
      },
    },
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        input: false,
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
      defaultRole: "USER",
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
        await prisma.user.update({
          where: { id: ctx.context.newUser.id },
          data: {
            acceptedTerms: true,
            acceptedTermsAt: new Date(),
          },
        });
      }
    }
  }),
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
