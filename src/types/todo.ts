export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "active" | "completed" | "paused";

export interface Todo {
  id: string;
  title: string;
  dueDate?: Date;
  priority: TodoPriority;
  status: TodoStatus;
  createdAt: Date;
  completedAt?: Date;
}
