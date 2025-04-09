import { protectedProcedure, router } from "../trpc-init";
import { createTag, getTags } from "./tag.service";
import { createTagValidator, getTagsValidator } from "./tag.validator";

export const tagRouter = router({
  createTag: protectedProcedure
    .input(createTagValidator)
    .mutation(async ({ ctx, input }) => {
      return await createTag(input, ctx);
    }),
  getTags: protectedProcedure
    .input(getTagsValidator)
    .query(async ({ ctx, input }) => {
      return await getTags(input, ctx);
    }),
});
