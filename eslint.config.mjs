import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Configs merge top to bottom: when two entries set the same rule, the later
// one wins. A later entry that sets only a severity keeps the earlier options.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Full jsx-a11y strict ruleset, as errors.
  { rules: jsxA11y.flatConfigs.strict.rules },
  // Turn off stylistic rules that conflict with Prettier. Keep it after the
  // rule configs above so it overrides them.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
