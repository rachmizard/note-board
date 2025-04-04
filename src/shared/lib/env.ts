import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const appEnv = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_URL_DEV: z.string().url(),
  },
  client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: process.env,
  clientPrefix: "NEXT_PUBLIC_",
});
