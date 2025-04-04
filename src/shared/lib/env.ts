import { z } from "zod";

import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

/**
 * Define schema for environment variables
 */
export const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("Invalid database URL")
    .describe("Production database URL"),
  DATABASE_URL_DEV: z
    .string()
    .url("Invalid database URL")
    .describe("Development database URL"),
});

// Create a type from the schema
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables against the schema
 */
export function validateEnv() {
  try {
    // Using Bun's process.env which is automatically loaded from .env.local
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();
      const missingVars = Object.entries(formattedErrors)
        .filter(([key]) => key !== "_errors")
        .map(([key, val]) => {
          // Safely access _errors with proper type handling
          const errors =
            val && typeof val === "object" && "_errors" in val
              ? (val._errors as string[]).join(", ")
              : "Invalid value";
          return `${key}: ${errors}`;
        });

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join("\n")}`
      );
    }

    throw error;
  }
}

/**
 * Type-safe environment variables
 */
export const env = validateEnv() as Env;
