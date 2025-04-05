import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Export commonly used tRPC utilities
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
