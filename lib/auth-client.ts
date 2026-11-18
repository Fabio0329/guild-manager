// Browser side of Better Auth: calls our own /api/auth/* endpoints. Holds no
// secrets, so it's safe in client components. Defaults to the page's origin.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
