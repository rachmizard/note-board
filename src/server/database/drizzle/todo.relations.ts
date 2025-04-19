import { relations } from "drizzle-orm";
import {
  todoComments,
  todoSchema,
  todoTags,
  todoSubTasks,
} from "./todo.schema";
import { users } from "./user.schema";
import { tags } from "./tag.schema";

export const todoRelations = relations(todoSchema, ({ many, one }) => ({
  tags: many(todoTags),
  comments: many(todoComments),
  subTasks: many(todoSubTasks),
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
  tag: one(tags, {
    fields: [todoTags.tagId],
    references: [tags.id],
  }),
}));

export const todoCommentRelations = relations(todoComments, ({ one }) => ({
  todo: one(todoSchema, {
    fields: [todoComments.todoId],
    references: [todoSchema.id],
  }),
  user: one(users, {
    fields: [todoComments.userId],
    references: [users.id],
  }),
}));

export const todoSubTaskRelations = relations(todoSubTasks, ({ one }) => ({
  todo: one(todoSchema, {
    fields: [todoSubTasks.todoId],
    references: [todoSchema.id],
  }),
}));
