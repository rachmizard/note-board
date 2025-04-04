import { initTRPC } from "@trpc/server";

// Create context type - using Record<string, unknown> to avoid empty object linter errors
export type Context = Record<string, unknown>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export commonly used tRPC utilities
export const router = t.router;
export const publicProcedure = t.procedure;

// Example router with a "hello" query
export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {
      message: "Hello World!",
    };
  }),
});

// Export router type
export type AppRouter = typeof appRouter;
