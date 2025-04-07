import * as pgCore from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { Tag, tags } from "./tag.schema";

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
  userId: pgCore
    .text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .$default(() => ""),
  estimatedTime: pgCore.time("estimated_time"),
  completedAt: pgCore.timestamp("completed_at"),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export const todoTags = pgCore.pgTable("todo_tags", {
  id: pgCore.serial("id").primaryKey(),
  tagId: pgCore.integer("tag_id").references(() => tags.id, {
    onDelete: "cascade",
  }),
  todoId: pgCore.integer("todo_id").references(() => todoSchema.id, {
    onDelete: "cascade",
  }),
});

export const todoComments = pgCore.pgTable("todo_comments", {
  id: pgCore.serial("id").primaryKey(),
  comment: pgCore.text("comment").notNull(),
  todoId: pgCore.integer("todo_id").references(() => todoSchema.id, {
    onDelete: "cascade",
  }),
  userId: pgCore
    .text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .$default(() => ""),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export const todoSubTasks = pgCore.pgTable("todo_sub_tasks", {
  id: pgCore.serial("id").primaryKey(),
  title: pgCore.text("title").notNull(),
  completed: pgCore.boolean("completed").default(false).notNull(),
  todoId: pgCore.integer("todo_id").references(() => todoSchema.id, {
    onDelete: "cascade",
  }),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export type Todo = typeof todoSchema.$inferSelect;
export type TodoWithRelations = Todo & {
  tags: TodoTagWithRelations[] | null;
  comments: TodoComment[] | null;
  subTasks: TodoSubTask[] | null;
};

export type TodoTagWithRelations = TodoTag & {
  tag: Tag | null;
};
export type TodoTag = typeof todoTags.$inferSelect;
export type TodoComment = typeof todoComments.$inferSelect;
export type TodoSubTask = typeof todoSubTasks.$inferSelect;

export type NewTodo = typeof todoSchema.$inferInsert;
export type NewTodoTags = typeof todoTags.$inferInsert;
export type NewTodoComments = typeof todoComments.$inferInsert;
export type NewTodoSubTask = typeof todoSubTasks.$inferInsert;
