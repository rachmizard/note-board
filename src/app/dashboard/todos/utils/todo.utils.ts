import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";
import { TodoStatus } from "@/types/todo";

// Helper function to map server todo status to frontend todo status
export const mapTodoStatusFromServer = (status: TodoStatusEnum): TodoStatus => {
  switch (status) {
    case TodoStatusEnum.IN_PROGRESS:
      return "inprogress";
    case TodoStatusEnum.COMPLETED:
      return "completed";
    case TodoStatusEnum.BACKLOG:
      return "backlog";
    case TodoStatusEnum.ARCHIVED:
      return "archived";
    default:
      return "backlog";
  }
};
