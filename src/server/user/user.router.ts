import { publicProcedure, router } from "../trpc-init";

import { createUser, createUserSessionProvider } from "./user.service";

import {
  createUserValidator,
  createUserSessionProviderValidator,
} from "./user.validator";

export const userRouter = router({
  createUser: publicProcedure
    .input(createUserValidator)
    .mutation(async ({ input, ctx }) => {
      return await createUser(input, ctx.db);
    }),
  createUserSessionProvider: publicProcedure
    .input(createUserSessionProviderValidator)
    .mutation(async ({ input, ctx }) => {
      return await createUserSessionProvider(input, ctx.db);
    }),
});
