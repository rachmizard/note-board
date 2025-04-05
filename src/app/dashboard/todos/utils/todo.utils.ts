import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";

// Helper function to map server todo status to frontend todo status
export const mapTodoStatusFromServer = (status: TodoStatusEnum): string => {
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
