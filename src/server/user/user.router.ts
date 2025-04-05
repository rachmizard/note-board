import { publicProcedure, router } from "../trpc-init";

import { createUser } from "./user.service";

import { createUserValidator } from "./user.validator";

export const userRouter = router({
  createUser: publicProcedure
    .input(createUserValidator)
    .mutation(async ({ input, ctx }) => {
      return await createUser(input, ctx.db);
    }),
});
