// Every Better Auth endpoint lives under /api/auth/*: starting a sign-in,
// the providers' callbacks (/api/auth/callback/<provider>), the session,
// and sign-out. [...all] catches all of those paths and hands them over.
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

export const { GET, POST } = toNextJsHandler(auth);
