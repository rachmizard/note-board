import { relations } from "drizzle-orm";
import { tags } from "./tag.schema";
import { users } from "./user.schema";
import { todoTags } from "./todo.schema";

export const tagRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  todos: many(todoTags),
}));
