import { relations } from "drizzle-orm";
import { todoComments, todoSchema } from "./todo.schema";
import { users } from "./user.schema";

export const userRelations = relations(users, ({ many }) => ({
  todos: many(todoSchema),
  todoComments: many(todoComments),
}));
