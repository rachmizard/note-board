import { TodoTag } from "@/server/database";

export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "in-progress" | "completed" | "backlog" | "archived";

export interface TodoComment {
  id: string;
  text: string;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  dueDate?: Date;
  priority: TodoPriority;
  status: TodoStatus;
  createdAt: Date;
  completedAt?: Date;
  comments?: TodoComment[];
  tags?: TodoTag[];
}
