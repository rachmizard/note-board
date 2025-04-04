import { defineConfig } from "drizzle-kit";
import { env } from "./src/shared/lib/env";

export default defineConfig({
  schema: "./src/shared/lib/database/drizzle/index.ts",
  out: "./src/shared/lib/database/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Customize your migration settings as needed
  verbose: true,
  strict: true,
});
