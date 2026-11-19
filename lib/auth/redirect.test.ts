import { describe, expect, it } from "vitest";
import { safeCallbackPath, signInPath } from "./redirect";

describe("signInPath", () => {
  it("remembers the page, encoded so its own ?query survives", () => {
    expect(signInPath("/account")).toBe("/sign-in?callbackURL=%2Faccount");
    expect(signInPath("/roster?class=mage")).toBe(
      "/sign-in?callbackURL=%2Froster%3Fclass%3Dmage",
    );
  });
});

describe("safeCallbackPath", () => {
  it.each([
    { input: "/account", expected: "/account" },
    { input: "/roster?class=mage", expected: "/roster?class=mage" },
  ])("keeps the path on this site: $input", ({ input, expected }) => {
    expect(safeCallbackPath(input)).toBe(expected);
  });

  it.each([
    { label: "another site", input: "https://evil.example/login" },
    { label: "a protocol-relative URL", input: "//evil.example" },
    { label: "a backslash trick", input: "/\\evil.example" },
    { label: "a javascript: URL", input: "javascript:alert(1)" },
    { label: "a relative path", input: "account" },
    { label: "nothing", input: undefined },
    { label: "a repeated parameter (array)", input: ["/a", "/b"] },
  ])("refuses $label, falling back to home", ({ input }) => {
    expect(safeCallbackPath(input)).toBe("/");
  });
});
