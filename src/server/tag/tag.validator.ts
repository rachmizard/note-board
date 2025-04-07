import { z } from "zod";

export const createTagValidator = z.object({
  name: z.string().min(1),
  type: z.enum(["todo"]),
});

export const getTagsValidator = z.object({
  type: z.enum(["todo"]).nullish(),
  keyword: z.string().nullish(),
});

export type CreateTagRequest = z.infer<typeof createTagValidator>;
export type GetTagsRequest = z.infer<typeof getTagsValidator>;
