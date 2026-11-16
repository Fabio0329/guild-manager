// Server environment variables, checked once when the server first loads
// this file. A missing or malformed value stops the app with a clear message
// instead of failing later on the first query. Server-only, so neither the
// values nor Zod itself are ever bundled for the browser.
import "server-only";

import { z } from "zod";

const envSchema = z.object({
  // Any postgres:// or postgresql:// URL, e.g. the local one in .env.example.
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Invalid environment variables (see .env.example):\n${z.prettifyError(result.error)}`,
  );
}

// Typed and validated: env.DATABASE_URL is a string, never undefined.
export const env = result.data;
