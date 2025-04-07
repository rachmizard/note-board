import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";
import { todoRouter } from "./todo/todo.router";
import { router } from "./trpc-init";
import { userRouter } from "./user/user.router";

const moduleRouter = router({
  todo: todoRouter,
  user: userRouter,
});

// Create the appRouter instance
export const appRouter = mergeRouters(moduleRouter);

// Export router type
export type AppRouter = typeof appRouter;
