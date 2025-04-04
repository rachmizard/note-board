import { Todo, TodoPriority, TodoStatus } from "@/types/todo";

export const generateMockTodos = (count: number = 5): Todo[] => {
  const priorities: TodoPriority[] = ["low", "medium", "high"];
  const statuses: TodoStatus[] = [
    "in-progress",
    "completed",
    "backlog",
    "archived",
  ];

  return Array.from({ length: count }).map((_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `todo-${index + 1}`,
      title: `Todo Item ${index + 1}`,
      dueDate: new Date(
        Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
      ),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      createdAt: new Date(),
      completedAt: status === "completed" ? new Date() : undefined,
    };
  });
};

export const mockTodos = generateMockTodos(1);
