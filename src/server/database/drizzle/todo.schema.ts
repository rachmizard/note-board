import * as pgCore from "drizzle-orm/pg-core";

export enum TodoPriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}
// Define priority enum
export const todoPriority = pgCore.pgEnum("todo_priority", [
  TodoPriorityEnum.LOW,
  TodoPriorityEnum.MEDIUM,
  TodoPriorityEnum.HIGH,
  TodoPriorityEnum.CRITICAL,
]);

export enum TodoStatusEnum {
  IN_PROGRESS = "inprogress",
  COMPLETED = "completed",
  BACKLOG = "backlog",
  ARCHIVED = "archived",
}

// Define status enum
export const todoStatus = pgCore.pgEnum("todo_status", [
  TodoStatusEnum.IN_PROGRESS,
  TodoStatusEnum.COMPLETED,
  TodoStatusEnum.BACKLOG,
  TodoStatusEnum.ARCHIVED,
]);

export const todoSchema = pgCore.pgTable("todos", {
  id: pgCore.serial("id").primaryKey(),
  title: pgCore.text("title").notNull(),
  dueDate: pgCore.timestamp("due_date"),
  description: pgCore.text("description"),
  priority: todoPriority("priority").default(TodoPriorityEnum.MEDIUM).notNull(),
  status: todoStatus("status").default(TodoStatusEnum.BACKLOG).notNull(),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export const todoTags = pgCore.pgTable("todo_tags", {
  id: pgCore.serial("id").primaryKey(),
  name: pgCore.text("name").notNull(),
  todoId: pgCore.integer("todo_id").references(() => todoSchema.id),
});

export const todoComments = pgCore.pgTable("todo_comments", {
  id: pgCore.serial("id").primaryKey(),
  comment: pgCore.text("comment").notNull(),
  todoId: pgCore.integer("todo_id").references(() => todoSchema.id),
  // TODO: add user id
});

export type Todo = typeof todoSchema.$inferSelect;
export type TodoTags = typeof todoTags.$inferSelect;
export type TodoComments = typeof todoComments.$inferSelect;

export type NewTodo = typeof todoSchema.$inferInsert;
export type NewTodoTags = typeof todoTags.$inferInsert;
export type NewTodoComments = typeof todoComments.$inferInsert;
