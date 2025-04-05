import {
  Todo,
  TodoPriorityEnum,
  TodoStatusEnum,
} from "@/server/database/drizzle/todo.schema";

export const generateMockTodos = (count: number = 5): Todo[] => {
  const priorities: TodoPriorityEnum[] = [
    TodoPriorityEnum.LOW,
    TodoPriorityEnum.MEDIUM,
    TodoPriorityEnum.HIGH,
  ];
  const statuses: TodoStatusEnum[] = [
    TodoStatusEnum.IN_PROGRESS,
    TodoStatusEnum.COMPLETED,
    TodoStatusEnum.BACKLOG,
    TodoStatusEnum.ARCHIVED,
  ];

  return Array.from({ length: count }).map((_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: index + 1,
      title: `Todo Item ${index + 1}`,
      dueDate: new Date(
        Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
      ),
      description: null,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: status === TodoStatusEnum.COMPLETED ? new Date() : null,
    };
  });
};

export const mockTodos = generateMockTodos(1);
