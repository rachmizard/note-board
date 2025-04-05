import { relations } from "drizzle-orm";
import { todoComments, todoSchema, todoTags } from "./todo.schema";
import { users } from "./user.schema";

export const todoRelations = relations(todoSchema, ({ many, one }) => ({
  tags: many(todoTags),
  comments: many(todoComments),
  user: one(users, {
    fields: [todoSchema.userId],
    references: [users.id],
  }),
}));

export const todoTagRelations = relations(todoTags, ({ one }) => ({
  todo: one(todoSchema, {
    fields: [todoTags.todoId],
    references: [todoSchema.id],
  }),
}));

export const todoCommentRelations = relations(todoComments, ({ one }) => ({
  todo: one(todoSchema, {
    fields: [todoComments.todoId],
    references: [todoSchema.id],
  }),
}));
