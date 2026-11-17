// Server environment variables, checked once when the server first loads
// this file. A missing or malformed value stops the app with a clear message
// instead of failing later on the first query. Server-only, so neither the
// values nor Zod itself are ever bundled for the browser.
import "server-only";

import { z } from "zod";

// Set and not blank: the placeholders in .env.example are empty on purpose.
const nonBlank = z.string().trim().nonempty("Required; see .env.example");

const envSchema = z.object({
  // Any postgres:// or postgresql:// URL, e.g. the local one in .env.example.
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

  // OAuth client credentials from each provider's developer portal. The IDs
  // are public; the secrets must never reach the browser (this file is
  // server-only).
  BATTLENET_CLIENT_ID: nonBlank,
  BATTLENET_CLIENT_SECRET: nonBlank,
  // Discord's client ID is the app's numeric Application ID.
  DISCORD_CLIENT_ID: z
    .string()
    .regex(/^\d+$/, "Must be the numeric Application ID from Discord"),
  DISCORD_CLIENT_SECRET: nonBlank,
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Invalid environment variables (see .env.example):\n${z.prettifyError(result.error)}`,
  );
}

// Typed and validated: every value is a string, never undefined.
export const env = result.data;
