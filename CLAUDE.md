@AGENTS.md

# Guild Manager

A website for a World of Warcraft guild: roster first, then raids and
recruitment. Members sign in with Battle.net or Discord.

## Done means `npm run check` passes

`npm run check` runs lint, format check, typecheck, unit tests, and the
page-level a11y tests. Nothing is finished while it fails. The hooks in
`.claude/` enforce this (lint after each edit, `check` before a turn ends)
and CI runs the same steps on every PR.

When a check fails, fix the cause. Never disable a lint rule, weaken or
delete a test, or edit lint/test config or the hooks to get past it.

## Workflow

- Work on a branch; changes reach `main` only through a PR.
- One logical change per commit: a summary line and a short bullet body.
- Prefer well-known libraries over custom code for solved problems.

## Architecture

- **Next.js 16**, App Router, `cacheComponents` on. Read the guide in
  `node_modules/next/dist/docs/` before using an API (see AGENTS.md).
- **PostgreSQL 17** locally via Docker Compose (`npm run db:up`, host port
  5433). **Prisma 7** with the `pg` driver adapter.
- Folders:
  - `app/`: routes and the root layout.
  - `components/<feature>/`: one component per file; shared ones go in
    `components/ui/`.
  - `lib/`: code safe to run anywhere (site identity, fonts, theme).
    `lib/auth/`: the browser auth client and the provider list.
  - `server/`: server-only code. `server/db/client.ts` exports the single
    `db` client; `server/env.ts` validates env vars with Zod;
    `server/auth/`: Better Auth's config (`config.ts`), `getSession()`,
    and `listAccounts()`.
  - `prisma/`: the schema and migrations, read by the Prisma CLI.
  - `test/vitest/`: Vitest support. `test/e2e/`: Playwright specs.

## Conventions

### Code style

- Components are named exports, typed arrow consts with a separate props
  type: `export const Thing: FC<ThingProps> = ({ label }) => { ... }`.
  Plain `FC` when there are no props. Framework files (`page.tsx`,
  `layout.tsx`, ...) keep `export default function`.
- Braces on every `if` and loop, even one-liners. Arrow functions with a
  multi-line body use a block and an explicit `return`.
- Import types with `import type`.

### Styling

- Use the design tokens in `app/globals.css` (`bg-background`,
  `text-muted`, `border-border`, `bg-surface`, `text-accent`, ...). Never
  a raw hex value or a Tailwind palette color.
- Dark mode is `data-theme="dark"` on `<html>`, set before first paint by
  the script in `lib/theme.ts`.
- `app/theme-contrast.test.ts` checks every text/background token pair is
  at least 4.5:1 in both themes. Changing a token runs it.

### Accessibility (WCAG 2.1 AA)

- ESLint runs the full jsx-a11y strict ruleset with zero warnings allowed.
- Every component gets a `vitest-axe` test asserting no violations.
- Every public page is listed in `test/e2e/routes.ts`, so Playwright runs
  axe on it in both themes and at 320px wide.

### Tests

- Unit and component tests sit next to their code as `*.test.ts(x)`
  (Vitest, jsdom, Testing Library).
- Page tests are `test/e2e/*.spec.ts` (Playwright, against a production
  build). They run against `guild_manager_test` with the settings in
  `test/e2e/env.ts` (global setup creates, migrates, and empties it).
  For signed-in pages use `signInAsNewUser(context)` from
  `test/e2e/test-auth.ts`; never add Better Auth's `testUtils` plugin to
  `server/auth/config.ts`.
- New routes go in `test/e2e/routes.ts` (public, protected, or
  signed-out-only), so every page gets axe and reflow checks.
- A new check must be seen failing once: break the code, watch it fail,
  restore it.

### Server code and data

- Any module that touches the database, secrets, or `server/env.ts` starts
  with `import "server-only"`, so a client component importing it fails the
  build.
- Read env vars through `env` from `server/env.ts`, not `process.env`. Add
  new variables to its schema and to `.env.example`.
- Keep Zod schemas out of `"use client"` files: Zod adds about 27 KB
  gzipped to the browser bundle. Client code imports only the inferred
  types (`import type`).
- Change the data model in `prisma/schema.prisma`, then run
  `npm run db:migrate`. Commit the generated migration with the schema
  change.
- Prisma is pinned to 7.x: npm's `latest` tag has pointed at an 8.0
  release candidate. Don't upgrade across a major without asking.

## Scaffold reference

The setup follows the `scaffold-new-app` skill
(`~/.claude/skills/scaffold-new-app/`). When a convention here changes,
update the skill too.
