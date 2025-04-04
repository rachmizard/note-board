import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env";

export default defineConfig({
  schema: "./src/lib/database/drizzle/index.ts",
  out: "./src/lib/database/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Customize your migration settings as needed
  verbose: true,
  strict: true,
});
