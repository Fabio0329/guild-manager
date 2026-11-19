import { expect, test } from "@playwright/test";
import { protectedRoutes } from "./routes";

for (const route of protectedRoutes) {
  test(`${route} sends a signed-out visitor to sign in, and back afterwards`, async ({
    page,
  }) => {
    await page.goto(route);

    await expect(page).toHaveURL(
      `/sign-in?callbackURL=${encodeURIComponent(route)}`,
    );
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeVisible();
  });

  test(`${route} turns away a forged session cookie on the server`, async ({
    page,
    context,
    baseURL,
  }) => {
    // proxy.ts only checks that the cookie exists, so this gets past it. The
    // server-side check (requireSession) verifies it and must still say no.
    await context.addCookies([
      {
        name: "better-auth.session_token",
        value: "forged-token.forged-signature",
        url: baseURL,
      },
    ]);

    await page.goto(route);

    await expect(page).toHaveURL(/\/sign-in\?callbackURL=/);
  });
}
