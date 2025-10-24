import { adminClient, inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies(), magicLinkClient(), adminClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  admin,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
  updateUser,
} = authClient;
