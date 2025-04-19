import { Button } from "@/shared/components/ui/button";
import React from "react";
import { useTodoSubTasks } from "../../../hooks/todo/use-todo-subtasks";
import { SubTaskItem } from "./sub-task-item";

interface SubTaskListProps {
  todoId: number;
  isExpanded: boolean;
  subtaskCount: number;
  onManage?: (e: React.MouseEvent) => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  todoId,
  isExpanded,
  subtaskCount,
  onManage,
}) => {
  // Fetch subtasks when expanded for preview
  const subTasksInfiniteQuery = useTodoSubTasks({
    todoId,
    limit: 3,
    enabled: isExpanded && todoId !== undefined,
  });

  const subtasks = subTasksInfiniteQuery.data?.pages.flatMap(
    (page) => page.data
  );

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Sub-Tasks</h4>
        {onManage && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onManage(e);
            }}
          >
            Manage
          </Button>
        )}
      </div>

      <div className="space-y-1 max-h-[150px] overflow-y-auto pr-2">
        {subtasks && subtasks.length > 0 ? (
          <>
            {subtasks.map((subTask) => (
              <SubTaskItem key={subTask.id} subTask={subTask} />
            ))}
            {subtaskCount > subtasks.length && (
              <div className="text-xs text-neutral-500 text-center">
                +{subtaskCount - subtasks.length} more sub-tasks
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-neutral-500 text-center">
            No sub-tasks available
          </div>
        )}
      </div>
    </div>
  );
};
