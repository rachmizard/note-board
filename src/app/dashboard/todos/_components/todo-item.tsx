import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import { formatDate, getPriorityColor } from "@/utils/todo-utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  FolderClosed,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Tag as TagIcon,
  Trash,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CommentDialog } from "./dialogs/comment-dialog";
import { TagDialog } from "./dialogs/tag-dialog";
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog";
import { cn } from "@/shared/lib/utils";
import { DatePicker } from "@/shared/components/ui/datepicker";
import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";
import { Badge } from "@/shared/components/ui/badge";

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
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [editedPriority, setEditedPriority] = useState<TodoPriority>(
    todo.priority
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // New state for inline title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [inlineEditedTitle, setInlineEditedTitle] = useState(todo.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Dialog state variables
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);

  // Add state to track priority dropdown open status
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  // Add state to track mobile action menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Compute if any interaction is active
  const isInteracting =
    showCommentModal ||
    showDeleteDialog ||
    showTagDialog ||
    isPriorityDropdownOpen ||
    isMobileMenuOpen;

  // Effect to focus the input when inline editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Define priority options for the combobox
  const priorityOptions: ComboboxOption[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleSaveEdit = () => {
    onUpdate(todo.id, {
      title: editedTitle,
      dueDate: editedDueDate,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  // New handler for saving inline title edits
  const handleSaveInlineTitleEdit = () => {
    if (inlineEditedTitle.trim() !== "") {
      onUpdate(todo.id, { title: inlineEditedTitle });
      setEditedTitle(inlineEditedTitle); // Keep the main edit state in sync
    } else {
      setInlineEditedTitle(todo.title); // Reset if empty
    }
    setIsEditingTitle(false);
  };

  // Handler for keyboard events on the inline title input
  const handleTitleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveInlineTitleEdit();
    } else if (e.key === "Escape") {
      setInlineEditedTitle(todo.title);
      setIsEditingTitle(false);
    }
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

  // New handler to toggle expansion when clicking on the todo item
  const handleTodoItemClick = (e: React.MouseEvent) => {
    // Don't toggle expansion when clicking on interactive elements
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.closest("h3") ||
        e.target.closest('[role="menuitem"]') ||
        isEditingTitle)
    ) {
      return;
    }

    setIsExpanded(!isExpanded);
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
      className={cn(
        "border-b py-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200",
        todo.status === "completed" && "opacity-70",
        !isEditing && "cursor-pointer" // Add cursor-pointer when not in edit mode
      )}
      onClick={!isEditing ? handleTodoItemClick : undefined} // Only enable click handler when not editing
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
              <DatePicker
                value={editedDueDate}
                onChange={(date) => setEditedDueDate(date)}
                placeholder="Select a due date"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Priority:</p>
              <Combobox
                value={editedPriority}
                onChange={(value) => setEditedPriority(value as TodoPriority)}
                options={priorityOptions}
                placeholder="Select priority"
                emptyText="No priority options available"
              />
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
            <div className="flex items-start flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "p-1 rounded-md mr-3 mt-1 flex items-center justify-center h-5 w-5 border",
                      todo.status === "completed"
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300"
                    )}
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
                  {isEditingTitle ? (
                    <Input
                      ref={titleInputRef}
                      value={inlineEditedTitle}
                      onChange={(e) => setInlineEditedTitle(e.target.value)}
                      onBlur={handleSaveInlineTitleEdit}
                      onKeyDown={handleTitleInputKeyDown}
                      className="min-w-[200px] h-7 py-1 px-2"
                    />
                  ) : (
                    <h3
                      className={cn(
                        "font-medium cursor-pointer",
                        todo.status === "completed" &&
                          "line-through text-gray-500"
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the container click
                        setIsEditingTitle(true);
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the container click
                        setIsEditingTitle(true);
                      }}
                    >
                      {todo.title}
                    </h3>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the container click
                      setIsExpanded(!isExpanded);
                    }}
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
                  <Badge className="mt-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Today
                  </Badge>
                )}

                {!isToday && todo.dueDate && (
                  <Badge className="mt-1 bg-red-100 text-red-800 hover:bg-red-100">
                    {formattedDate}
                  </Badge>
                )}

                {/* Optional: Additional tag example like "win" from the reference image */}
                {todo.priority === "high" && (
                  <Badge className="mt-1 ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    win
                  </Badge>
                )}

                {/* Display tags if available */}
                {todo.tags && todo.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {todo.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop action buttons - visible on hover */}
            <div
              className={cn(
                "hidden md:flex space-x-1 transition-opacity duration-200",
                isInteracting
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()} // Prevent triggering container click
            >
              {/* Priority dropdown using shadcn DropdownMenu */}
              <DropdownMenu onOpenChange={setIsPriorityDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag
                      className={cn(
                        "h-4 w-4",
                        getPriorityColor(todo.priority).replace("bg-", "text-")
                      )}
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

              {/* Other desktop action buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  setShowCommentModal(true);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  setShowTagDialog(true);
                }}
              >
                <TagIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  /* Implement folder functionality */
                }}
              >
                <FolderClosed className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  setShowDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile action button - always visible */}
            <div
              className="block md:hidden !opacity-100"
              onClick={(e) => e.stopPropagation()} // Prevent triggering container click
            >
              <DropdownMenu onOpenChange={setIsMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCommentModal(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Add Comment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowTagDialog(true)}>
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>Manage Tags</span>
                  </DropdownMenuItem>

                  {/* Priority submenu items */}
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

                  <DropdownMenuItem
                    onClick={() => {
                      /* Implement folder functionality */
                    }}
                  >
                    <FolderClosed className="h-4 w-4 mr-2" />
                    <span>Move to Folder</span>
                  </DropdownMenuItem>

                  {/* Delete with confirmation (will trigger dialog) */}
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-500"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isExpanded && !isEditing && (
            <div className="px-4 pb-2 mt-3 grid gap-3 text-sm">
              {/* Due date section */}
              {todo.dueDate && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span
                    className={cn(
                      "text-gray-700 dark:text-gray-300",
                      isToday &&
                        "text-amber-700 dark:text-amber-400 font-medium"
                    )}
                  >
                    {formattedDate}
                    {isToday && (
                      <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                        (Today)
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Tags section */}
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <TagIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {todo.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes section - summarized version */}
              {todo.comments && todo.comments.length > 0 && (
                <div className="flex items-start">
                  <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium text-xs mb-1">
                      Comments ({todo.comments.length})
                    </p>
                    <p className="line-clamp-2">{todo.comments[0].text}</p>
                  </div>
                </div>
              )}

              {/* Completion date if completed */}
              {todo.status === "completed" && todo.completedAt && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  <span>Completed on {formatDate(todo.completedAt)}</span>
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
