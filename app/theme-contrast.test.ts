import { parse, wcagContrast } from "culori";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Guards the design tokens in globals.css: every text color must meet WCAG AA
// (4.5:1) on every background it's used on, in both themes. Add a pair below
// whenever a new text/background combination appears in the UI.
//
// culori does the color work: it parses any CSS color (hex, rgb(), oklch(), …)
// and implements the WCAG 2.1 contrast ratio.

type Tokens = Record<string, string>;
const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
// e.g. input "  --muted: #52525b;" → match "--muted: #52525b;", group 1 "muted", group 2 "#52525b"
const customPropertyDeclaration = /--([\w-]+):\s*([^;]+);/g;

// Pulls the `--name: value;` declarations out of one selector's block. Fails
// loudly on a value culori can't read as a color, rather than skipping it.
const readTokens = (selector: string): Tokens => {
  const start = css.indexOf(`${selector} {`);

  if (start === -1) {
    throw new Error(`No "${selector}" block in globals.css`);
  }

  const block = css.slice(start, css.indexOf("}", start));

  return Object.fromEntries(
    [...block.matchAll(customPropertyDeclaration)].map(([, name, raw]) => {
      const value = raw.trim().toLowerCase();
      if (!parse(value)) {
        throw new Error(`--${name} in "${selector}" isn't a color: ${value}`);
      }
      return [name, value];
    }),
  );
};

const themes: Record<string, Tokens> = {
  light: readTokens(":root"),
  dark: readTokens(':root[data-theme="dark"]'),
};

// Rows for describe.each: { name: "light", tokens: {...} }, then dark.
const themeCases = Object.entries(themes).map(([name, tokens]) => ({
  name,
  tokens,
}));

// Text/background pairs the site uses.
const pairs = [
  { text: "foreground", background: "background" },
  { text: "muted", background: "background" },
  { text: "accent", background: "background" },
  { text: "foreground", background: "surface" }, // toggle hover
  { text: "muted", background: "surface" },
  { text: "accent", background: "surface" },
  { text: "background", background: "foreground" }, // the skip link
] as const;

// $name, $text and $background are filled in from each row's fields.
describe.each(themeCases)("$name theme", ({ tokens }) => {
  it.each(pairs)("$text on $background meets 4.5:1", ({ text, background }) => {
    expect(
      wcagContrast(tokens[text], tokens[background]),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe("token blocks stay in sync", () => {
  it("the no-JS dark fallback matches the dark theme", () => {
    expect(readTokens(":root:not([data-theme])")).toEqual(themes.dark);
  });
});
