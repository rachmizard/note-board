import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";
import { todoRouter } from "./todo/todo.router";

// Create the appRouter instance
export const appRouter = mergeRouters(todoRouter);

// Export router type
export type AppRouter = typeof appRouter;
