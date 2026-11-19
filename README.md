# Guild Manager

Guild management site: roster, raids, recruitment.

## Requirements

- Node.js 22 or newer
- Docker, for the local PostgreSQL database

## Setup

```sh
npm install                 # also generates the Prisma client
cp .env.example .env.local  # local settings; .env.local is never committed
npm run db:up               # start PostgreSQL in Docker (port 5433)
npm run db:deploy           # create the tables (apply the migrations)
```

Then fill in `.env.local` (each variable has a comment in `.env.example`):

1. **`BETTER_AUTH_SECRET`**: generate one with `npx auth secret` or
   `openssl rand -base64 32`.
2. **Battle.net**: create a client at develop.battle.net (API Access) with
   the redirect URL `http://localhost:3000/api/auth/callback/battlenet`, and
   copy its ID and secret into `BATTLENET_CLIENT_ID` / `_SECRET`.
3. **Discord**: create an application at discord.com/developers/applications;
   under OAuth2, add the redirect `http://localhost:3000/api/auth/callback/discord`,
   and copy its ID and secret into `DISCORD_CLIENT_ID` / `_SECRET`.

```sh
npm run dev                 # http://localhost:3000
```

The app refuses to start while a variable is missing or malformed, and says
which one.

Run `npx playwright install chromium` once before the page tests. They use
their own database, `guild_manager_test`, in the same Postgres: it's created
and migrated automatically and emptied at the start of each run, so your
dev data is never touched. They don't need real provider credentials.

## Scripts

| Script               | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Start the development server                                |
| `npm run build`      | Build for production                                        |
| `npm start`          | Serve the production build                                  |
| `npm run check`      | Everything below that must pass before work is done         |
| `npm run lint`       | ESLint, including the strict accessibility rules            |
| `npm run format`     | Format all files with Prettier (`format:check` only checks) |
| `npm run typecheck`  | Generate Prisma and route types, then run TypeScript        |
| `npm test`           | Unit and component tests (Vitest); `test:watch` reruns      |
| `npm run test:a11y`  | Page tests in a real browser (Playwright + axe)             |
| `npm run db:up`      | Start the database and wait until it's ready                |
| `npm run db:migrate` | Create and apply a migration, then regenerate the client    |
| `npm run db:deploy`  | Apply existing migrations (for hosted databases)            |
| `npm run db:studio`  | Browse the database in Prisma Studio                        |

Stop the database with `docker compose stop`. Its data stays in a Docker
volume until you run `docker compose down -v`.
