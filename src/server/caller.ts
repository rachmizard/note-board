import { createContext } from "./context";
import { appRouter } from "./router";
import { createCallerFactory } from "./trpc-init";

// 1. create a caller-function for your router
const createCaller = createCallerFactory(appRouter);

// 2. create a caller using your `Context`
export const serverSideCaller = createCaller(await createContext());
