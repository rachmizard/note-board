import { Env } from "@/lib/env";

declare global {
  namespace NodeJS {
    // Extend the ProcessEnv interface to provide type safety for environment variables
    interface ProcessEnv extends Env {
      // This is needed to prevent the "An interface declaring no members is equivalent to its supertype" error
      [key: string]: string | undefined;
    }
  }
}

// This needs to be exported as a module
export {};
