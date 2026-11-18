// Better Auth: sign-in, sessions, and linked accounts, stored in our own
// Postgres through Prisma. Server-only: it holds the secret and the
// providers' client secrets.
import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { db } from "@/server/db/client";
import { env } from "@/server/env";

// Better Auth requires a unique email per user, but the app doesn't use
// email and Battle.net doesn't provide one. Store a stand-in instead: the
// .invalid domain is reserved (RFC 2606), so nothing can ever be sent to it.
const placeholderEmail = (providerId: string, accountId: unknown) => {
  return `${providerId}-${String(accountId)}@users.invalid`;
};

// The first non-empty text value, for profile fields a provider may leave out.
const firstString = (...values: unknown[]) => {
  const found = values.find((value) => {
    return typeof value === "string" && value.trim() !== "";
  });
  return typeof found === "string" ? found : undefined;
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  account: {
    // Encrypt providers' access, refresh, and ID tokens before saving them,
    // so a database leak doesn't hand out working tokens.
    encryptOAuthTokens: true,
  },
  plugins: [
    // Both providers are configured from their OpenID Connect discovery
    // documents, so both get PKCE, a nonce, and a verified ID token.
    // (Better Auth's built-in Discord provider skips PKCE and the ID token,
    // though Discord supports both.)
    genericOAuth({
      config: [
        {
          providerId: "battlenet",
          name: "Battle.net",
          // Endpoints, issuer, and signing keys (JWKS) all come from here.
          discoveryUrl:
            "https://oauth.battle.net/.well-known/openid-configuration",
          clientId: env.BATTLENET_CLIENT_ID,
          clientSecret: env.BATTLENET_CLIENT_SECRET,
          scopes: ["openid"],
          // Refuse to run without a verifiable ID token: signature checked
          // against Battle.net's JWKS, plus the nonce from this sign-in.
          requireIdTokenVerification: true,
          mapProfileToUser: (profile) => {
            return {
              name:
                typeof profile.battletag === "string"
                  ? profile.battletag
                  : "Battle.net player",
              email: placeholderEmail("battlenet", profile.sub),
              emailVerified: false,
            };
          },
        },
        {
          providerId: "discord",
          name: "Discord",
          discoveryUrl: "https://discord.com/.well-known/openid-configuration",
          clientId: env.DISCORD_CLIENT_ID,
          clientSecret: env.DISCORD_CLIENT_SECRET,
          // `identify` is Discord's scope for the username and avatar. No
          // `email` scope: the app stores no real addresses.
          scopes: ["openid", "identify"],
          requireIdTokenVerification: true,
          mapProfileToUser: (profile) => {
            return {
              // OIDC claim names: `nickname` is the display name,
              // `preferred_username` the unique username.
              name:
                firstString(profile.nickname, profile.preferred_username) ??
                "Discord user",
              email: placeholderEmail("discord", profile.sub),
              emailVerified: false,
            };
          },
        },
      ],
    }),
  ],
});
