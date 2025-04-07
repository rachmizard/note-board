import { relations } from "drizzle-orm";
import { tags } from "./tag.schema";
import { todoComments, todoSchema } from "./todo.schema";
import { users } from "./user.schema";

export const userRelations = relations(users, ({ many }) => ({
  todos: many(todoSchema),
  todoComments: many(todoComments),
}));

export const userTagRelations = relations(users, ({ many }) => ({
  tags: many(tags),
}));
