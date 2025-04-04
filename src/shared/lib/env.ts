import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const appEnv = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_URL_DEV: z.string().url(),
  },
  client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
  },
  clientPrefix: "NEXT_PUBLIC_",
});
