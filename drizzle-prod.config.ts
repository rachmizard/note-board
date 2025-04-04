import { defineConfig } from "drizzle-kit";

import { loadEnvConfig } from "@next/env";

const cwd = process.cwd();
loadEnvConfig(cwd);

export default defineConfig({
  schema: "./src/server/database/drizzle/index.ts",
  out: "./src/server/database/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    schema: "public",
    table: "migrations",
    prefix: "none",
  },
  // Customize your migration settings as needed
  verbose: true,
  strict: true,
});
