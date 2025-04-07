import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const appEnv = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .describe("The URL of the database for production"),
    DATABASE_URL_DEV: z
      .string()
      .url()
      .describe("The URL of the database for development"),
    SIGNING_SECRET: z.string().describe("The signing secret for the webhook"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url()
      .optional()
      .describe("The URL of the app"),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: process.env,
  clientPrefix: "NEXT_PUBLIC_",
});
