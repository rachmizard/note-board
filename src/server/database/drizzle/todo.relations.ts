import { relations } from "drizzle-orm";
import { todoComments, todoSchema, todoTags } from "./todo.schema";

export const todoRelations = relations(todoSchema, ({ many }) => ({
  tags: many(todoTags),
  comments: many(todoComments),
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
