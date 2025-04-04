import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/utils/todo-utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  FolderClosed,
  MessageSquare,
  Pencil,
  Tag as TagIcon,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CommentDialog } from "./dialogs/comment-dialog";
import { TagDialog } from "./dialogs/tag-dialog";
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog";

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
  const [isExpanded, setIsExpanded] = useState(false);

  // Dialog state variables
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);

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
    } else if (newStatus === "in-progress" && todo.status === "completed") {
      updates.completedAt = undefined;
    }
    onUpdate(todo.id, updates);
  };

  // New handler for priority change
  const handlePriorityChange = (priority: TodoPriority) => {
    onUpdate(todo.id, { priority });
  };

  // Determine if the task is for today
  const isToday = todo.dueDate
    ? new Date(todo.dueDate).toDateString() === new Date().toDateString()
    : false;

  // Format date as "Month Day, Year" for display
  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`border-b py-3 ${
        todo.status === "completed" ? "opacity-70" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-3 px-4">
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
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} size="sm">
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`p-1 rounded-md mr-3 mt-1 flex items-center justify-center h-5 w-5 border ${
                      todo.status === "completed"
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {todo.status === "completed" && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("in-progress")}
                  >
                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                    <span>In Progress</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("completed")}
                  >
                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Completed</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("backlog")}
                  >
                    <FolderClosed className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Backlog</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("archived")}
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Archived</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1">
                <div className="flex items-start">
                  <h3
                    className={`font-medium ${
                      todo.status === "completed"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {isToday && (
                  <div className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium">
                    Today
                  </div>
                )}

                {!isToday && todo.dueDate && (
                  <div className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium">
                    {formattedDate}
                  </div>
                )}

                {/* Optional: Additional tag example like "win" from the reference image */}
                {todo.priority === "high" && (
                  <div className="mt-1 ml-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium">
                    win
                  </div>
                )}

                {/* Display tags if available */}
                {todo.tags && todo.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {todo.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-1">
              {/* Priority dropdown using shadcn DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag
                      className={`h-4 w-4 ${getPriorityColor(
                        todo.priority
                      ).replace("bg-", "text-")}`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePriorityChange("low")}>
                    <Flag className="h-4 w-4 mr-2 text-green-500" />
                    <span>Low Priority</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePriorityChange("medium")}
                  >
                    <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Medium Priority</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePriorityChange("high")}
                  >
                    <Flag className="h-4 w-4 mr-2 text-red-500" />
                    <span>High Priority</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Comment button with modal */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowCommentModal(true)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

              {/* Tag button with dialog */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowTagDialog(true)}
              >
                <TagIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  /* Implement folder functionality */
                }}
              >
                <FolderClosed className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              {/* Delete button with confirmation */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 ml-9 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  Due: {todo.dueDate ? formatDate(todo.dueDate) : "No due date"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span
                  className={`mr-2 inline-block px-2 py-0.5 rounded-full text-xs ${getPriorityColor(
                    todo.priority
                  )}`}
                >
                  {todo.priority}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                    todo.status
                  )}`}
                >
                  {todo.status}
                </span>
              </div>

              {/* Display comments if expanded and available */}
              {todo.comments && todo.comments.length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium">Comments</h4>
                  {todo.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 p-2 rounded-md text-sm"
                    >
                      <div className="text-gray-500 text-xs">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                      <div>{comment.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Separate Dialog Components */}
      <CommentDialog
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
        todo={todo}
        onAddComment={(comment) => {
          const comments = todo.comments || [];
          onUpdate(todo.id, {
            comments: [
              ...comments,
              {
                id: Date.now().toString(),
                text: comment,
                createdAt: new Date(),
              },
            ],
          });
        }}
      />

      <TagDialog
        open={showTagDialog}
        onOpenChange={setShowTagDialog}
        todo={todo}
        onAddTag={(tag) => {
          const tags = todo.tags || [];
          if (!tags.includes(tag)) {
            onUpdate(todo.id, { tags: [...tags, tag] });
          }
        }}
        onRemoveTag={(tag) => {
          const updatedTags = [...(todo.tags || [])].filter((t) => t !== tag);
          onUpdate(todo.id, { tags: updatedTags });
        }}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(todo.id)}
      />
    </div>
  );
};
