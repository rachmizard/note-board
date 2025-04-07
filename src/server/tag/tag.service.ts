import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { tags } from "../database";
import { CreateTagRequest, GetTagsRequest } from "./tag.validator";

/**
 * Create a new tag
 * @param request - The request object
 * @param context - The context object
 * @returns The created tag
 */
export const createTag = async (
  request: CreateTagRequest,
  context: Context
) => {
  const userId = context.auth?.userId;
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const tag = await context.db
    .insert(tags)
    .values({
      ...request,
      userId,
    })
    .returning();

  return tag[0];
};

/**
 * Get all tags
 * @param request - The request object
 * @param context - The context object
 * @returns The tags
 */
export const getTags = async (request: GetTagsRequest, context: Context) => {
  const userId = context.auth?.userId;
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const whereClause = [eq(tags.userId, userId)];
  if (request.type) {
    whereClause.push(eq(tags.type, request.type));
  }
  const result = await context.db
    .select()
    .from(tags)
    .where(and(...whereClause))
    .orderBy(desc(tags.createdAt));

  return result;
};
