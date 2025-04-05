import {
  Todo,
  TodoPriorityEnum,
  TodoStatusEnum,
  TodoTag,
} from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import {
  formatDate,
  getPriorityColor,
  getPriorityIconColor,
  getStatusColor,
} from "../_utils/todo.utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  FlagIcon,
  FolderClosed,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Tag as TagIcon,
  Trash,
} from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { TodoFormValues } from "../_validators/todo-form.validator";
import { CommentDialog } from "./dialogs/comment-dialog";
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog";
import { TagDialog } from "./dialogs/tag-dialog";
import { TodoForm } from "./todo-form";

interface TodoComment {
  id: string;
  text: string;
  createdAt: Date;
}

interface TodoWithRelations extends Todo {
  comments?: TodoComment[];
  tags?: TodoTag[];
}

interface TodoItemProps {
  todo: TodoWithRelations;
  onUpdate: (id: number, updates: Partial<TodoWithRelations>) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (todo.title !== inlineEditedTitle) {
      setInlineEditedTitle(todo.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo.title]);

  const handleSaveEdit = (values: TodoFormValues) => {
    onUpdate(todo.id, {
      title: values.title,
      dueDate: values.dueDate,
      priority: values.priority as TodoPriorityEnum,
    });
    setIsEditing(false);
  };

  // New handler for saving inline title edits
  const handleSaveInlineTitleEdit = () => {
    if (inlineEditedTitle.trim() !== "") {
      onUpdate(todo.id, { title: inlineEditedTitle });
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

  const handleStatusChange = (newStatus: TodoStatusEnum) => {
    const updates: Partial<TodoWithRelations> = { status: newStatus };
    if (newStatus === TodoStatusEnum.COMPLETED) {
      updates.completedAt = new Date();
    } else if (
      newStatus === TodoStatusEnum.IN_PROGRESS &&
      todo.status === TodoStatusEnum.COMPLETED
    ) {
      updates.completedAt = undefined;
    }
    onUpdate(todo.id, updates);
  };

  // New handler for priority change
  const handlePriorityChange = (priority: TodoPriorityEnum) => {
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
        e.target.closest('[role="button"]') ||
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
    <Fragment>
      <div
        className={cn(
          "border-b-1 dark:shadow-neutral-800 shadow-sm border-neutral-200 dark:border-neutral-800 px-2 py-3 rounded-xl group hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200",
          todo.status === TodoStatusEnum.COMPLETED && "opacity-70",
          !isEditing && "cursor-pointer" // Add cursor-pointer when not in edit mode
        )}
        onClick={!isEditing ? handleTodoItemClick : undefined} // Only enable click handler when not editing
      >
        {isEditing ? (
          <TodoForm
            onSubmit={handleSaveEdit}
            defaultValues={{
              title: todo.title,
              dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
              priority: todo.priority,
            }}
            onCancelEditing={() => setIsEditing(false)}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "p-1 rounded-md mr-3 mt-1 flex items-center justify-center h-5 w-5 border",
                        todo.status === TodoStatusEnum.COMPLETED
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-300"
                      )}
                    >
                      {todo.status === TodoStatusEnum.COMPLETED && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(TodoStatusEnum.IN_PROGRESS)
                      }
                    >
                      <Clock className="h-4 w-4 mr-2 text-green-500" />
                      <span>In Progress</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(TodoStatusEnum.COMPLETED)
                      }
                    >
                      <Check className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Completed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(TodoStatusEnum.BACKLOG)}
                    >
                      <FolderClosed className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Backlog</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(TodoStatusEnum.ARCHIVED)
                      }
                    >
                      <Trash className="h-4 w-4 mr-2 text-neutral-500" />
                      <span>Archived</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1">
                  <div className="flex items-center">
                    {isEditingTitle ? (
                      <Input
                        ref={titleInputRef}
                        value={inlineEditedTitle}
                        onChange={(e) => setInlineEditedTitle(e.target.value)}
                        onBlur={handleSaveInlineTitleEdit}
                        onKeyDown={handleTitleInputKeyDown}
                        className="w-fit min-w-fit h-7 py-1 px-2"
                      />
                    ) : (
                      <h3
                        className={cn(
                          "font-medium cursor-pointer",
                          todo.status === TodoStatusEnum.COMPLETED &&
                            "line-through"
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
                      className="ml-2 text-neutral-400 hover:text-neutral-600"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isToday && (
                    <div className="mt-1 inline-block rounded-full bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 text-xs font-medium">
                      Today
                    </div>
                  )}

                  {!isToday && todo.dueDate && (
                    <div className="mt-1 inline-block rounded-full bg-red-100 dark:bg-red-900 px-2 py-0.5 text-xs font-medium">
                      {formattedDate}
                    </div>
                  )}

                  {/* Optional: Additional tag example like "win" from the reference image */}
                  {todo.priority === TodoPriorityEnum.HIGH && (
                    <div className="mt-1 ml-2 inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium">
                      win
                    </div>
                  )}

                  {/* Display tags if available */}
                  {todo.tags && todo.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {todo.tags
                        .slice(0, todo.tags.length > 3 ? 2 : 3)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium"
                          >
                            {tag.name}
                          </div>
                        ))}
                      {todo.tags.length > 3 && (
                        <div className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-xs font-medium">
                          +{todo.tags.length - 2} More
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop action buttons - visible on hover */}
              <div
                className={cn(
                  "hidden md:flex space-x-1 transition-opacity duration-200 px-4",
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
                      <FlagIcon
                        className={cn(
                          "h-4 w-4",
                          getPriorityIconColor(todo.priority)
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange(TodoPriorityEnum.LOW)}
                    >
                      <Flag className="h-4 w-4 mr-2 text-green-500" />
                      <span>Low Priority</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handlePriorityChange(TodoPriorityEnum.MEDIUM)
                      }
                    >
                      <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Medium Priority</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handlePriorityChange(TodoPriorityEnum.HIGH)
                      }
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
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange(TodoPriorityEnum.LOW)}
                    >
                      <Flag className="h-4 w-4 mr-2 text-green-500" />
                      <span>Low Priority</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handlePriorityChange(TodoPriorityEnum.MEDIUM)
                      }
                    >
                      <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Medium Priority</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handlePriorityChange(TodoPriorityEnum.HIGH)
                      }
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

            {isExpanded && (
              <div className="mt-1 ml-9 space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    Due:{" "}
                    {todo.dueDate ? formatDate(todo.dueDate) : "No due date"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span
                    className={cn(
                      "mr-2 inline-block px-2 py-0.5 rounded-full text-xs",
                      getPriorityColor(todo.priority)
                    )}
                  >
                    {todo.priority}
                  </span>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs",
                      getStatusColor(todo.status)
                    )}
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
                        className="bg-neutral-50 p-2 rounded-md text-sm"
                      >
                        <div className="text-neutral-500 text-xs">
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
      </div>

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
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(todo.id)}
      />
    </Fragment>
  );
};
