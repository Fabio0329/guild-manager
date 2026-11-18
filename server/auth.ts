// Better Auth: sign-in, sessions, and linked accounts, stored in our own
// Postgres through Prisma. Server-only: it holds the secret and the
// providers' client secrets.
import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db/client";
import { env } from "@/server/env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  account: {
    // Encrypt providers' access, refresh, and ID tokens before saving them,
    // so a database leak doesn't hand out working tokens.
    encryptOAuthTokens: true,
  },
});
