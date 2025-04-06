import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Export commonly used tRPC utilities
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

// Register a middleware to check if the user is authenticated
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  return next({ ctx });
});

export const publicProcedure = t.procedure;

// Define a protected procedure that uses the isAuthenticated middleware
export const protectedProcedure = t.procedure.use(isAuthenticated);
