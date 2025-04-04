import React, { useState } from "react";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  isDueDateOverdue,
} from "@/utils/todo-utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Check, Clock, Pause, Pencil, Play, Trash, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDueDate, setEditedDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [editedPriority, setEditedPriority] = useState<TodoPriority>(
    todo.priority
  );

  const handleSaveEdit = () => {
    onUpdate(todo.id, {
      title: editedTitle,
      dueDate: editedDueDate ? new Date(editedDueDate) : undefined,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDueDate(
      todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
    );
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: TodoStatus) => {
    const updates: Partial<Todo> = { status: newStatus };
    if (newStatus === "completed") {
      updates.completedAt = new Date();
    } else if (newStatus === "active" && todo.status === "completed") {
      updates.completedAt = undefined;
    }
    onUpdate(todo.id, updates);
  };

  return (
    <div
      className={`p-4 border rounded-lg mb-2 ${
        todo.status === "completed" ? "opacity-70" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full"
            placeholder="Todo title"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm mb-1">Due Date:</p>
              <Input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Priority:</p>
              <select
                value={editedPriority}
                onChange={(e) =>
                  setEditedPriority(e.target.value as TodoPriority)
                }
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-3">
            <Button variant="outline" onClick={handleCancelEdit} size="sm">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSaveEdit} size="sm">
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <button
                onClick={() =>
                  handleStatusChange(
                    todo.status === "completed" ? "active" : "completed"
                  )
                }
                className={`p-1 rounded-full mr-3 ${
                  todo.status === "completed"
                    ? "bg-green-500 text-white"
                    : "border border-gray-300"
                }`}
              >
                {todo.status === "completed" && <Check className="h-4 w-4" />}
              </button>

              <div>
                <h3
                  className={`font-medium ${
                    todo.status === "completed"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {todo.title}
                </h3>

                {todo.dueDate && (
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span
                      className={`text-xs ${
                        isDueDateOverdue(todo.dueDate) &&
                        todo.status !== "completed"
                          ? "text-red-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {formatDate(todo.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                  todo.priority
                )}`}
              >
                {todo.priority}
              </span>

              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  todo.status
                )}`}
              >
                {todo.status}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-2 space-x-1">
            {todo.status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
            )}

            {todo.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("paused")}
              >
                <Pause className="h-3 w-3 mr-1" /> Pause
              </Button>
            )}

            {todo.status === "paused" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("active")}
              >
                <Play className="h-3 w-3 mr-1" /> Resume
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => onDelete(todo.id)}
            >
              <Trash className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
