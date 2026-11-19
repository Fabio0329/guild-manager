import { expect, test } from "@playwright/test";
import { baseURL } from "./env";
import { signInAsNewUser, testDb } from "./test-auth";

test("a signed-in user sees their name and connected accounts", async ({
  page,
  context,
}) => {
  const user = await signInAsNewUser(context);

  await page.goto("/account");

  // No redirect: the session was accepted by proxy.ts and requireSession.
  await expect(page).toHaveURL("/account");
  await expect(page.getByRole("link", { name: user.name })).toBeVisible();
  const battlenet = page
    .getByRole("listitem")
    .filter({ hasText: "Battle.net" });
  await expect(battlenet).toContainText("Connected");
  await expect(battlenet).toContainText("Your only way to sign in");
  await expect(
    page.getByRole("button", { name: "Connect Discord" }),
  ).toBeVisible();
});

test("signing out ends the session in the browser and the database", async ({
  page,
  context,
}) => {
  const user = await signInAsNewUser(context);
  await page.goto("/");

  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(
    page.getByRole("button", { name: "Sign in with Battle.net" }),
  ).toBeVisible();
  expect(await testDb.sessionCount(user.id)).toBe(0);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/sign-in\?callbackURL=/);
});

test("a user can't make themselves an officer", async ({ page, context }) => {
  const user = await signInAsNewUser(context);

  // Better Auth's own endpoint for users editing their profile. `role` is
  // input: false, so it must be refused, not quietly accepted.
  const response = await page.request.post("/api/auth/update-user", {
    data: { role: "officer" },
    // Better Auth checks the Origin header on writes (CSRF protection).
    headers: { Origin: baseURL },
  });

  expect(response.ok()).toBe(false);
  expect(await testDb.roleOf(user.id)).toBe("member");
});

test("a signed-in visitor on /sign-in is sent straight on", async ({
  page,
  context,
}) => {
  await signInAsNewUser(context);

  await page.goto("/sign-in?callbackURL=%2Faccount");

  await expect(page).toHaveURL("/account");
});
