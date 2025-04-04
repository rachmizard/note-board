import * as pgCore from "drizzle-orm/pg-core";

// Define priority enum
export const todoPriority = pgCore.pgEnum("todo_priority", [
  "low",
  "medium",
  "high",
]);

// Define status enum
export const todoStatus = pgCore.pgEnum("todo_status", [
  "active",
  "completed",
  "paused",
]);

export const todoSchema = pgCore.pgTable("todos", {
  id: pgCore.serial("id").primaryKey(),
  title: pgCore.text("title").notNull(),
  dueDate: pgCore.timestamp("due_date"),
  priority: todoPriority("priority").default("medium").notNull(),
  status: todoStatus("status").default("active").notNull(),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});
