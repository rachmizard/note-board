import { defineConfig } from "drizzle-kit";
import { appEnv } from "./src/shared/lib/env";

export default defineConfig({
  schema: "./src/server/database/drizzle/index.ts",
  out: "./src/server/database/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: appEnv.DATABASE_URL_DEV,
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
