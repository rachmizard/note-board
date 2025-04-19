import React, { useState } from "react";

import { AnimatedList } from "@/components/magicui/animated-list";
import { TodoWithRelations } from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Trash } from "lucide-react";
// Keep mutation hooks import paths relative to their location in the app
import { useRemoveTodoComment } from "../../../hooks/todo/use-remove-todo-comment";
import { useAddTodoComment } from "../../../hooks/todo/use-add-todo-comment";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoWithRelations;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onOpenChange,
  todo,
}) => {
  const [newComment, setNewComment] = useState("");

  const addTodoComment = useAddTodoComment();
  const removeTodoComment = useRemoveTodoComment();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setNewComment("");
    addTodoComment.mutate({
      todoId: todo.id,
      comment: newComment,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    removeTodoComment.mutate({
      todoId: todo.id,
      commentId,
    });
  };

  const handleKeyDownComment = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Comment
            </label>
            <textarea
              className="w-full border rounded-md p-2 min-h-[100px] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment here..."
              onKeyDown={handleKeyDownComment}
            />
          </div>

          {/* Display existing comments */}
          {todo.comments && todo.comments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 dark:text-neutral-300">
                Previous Comments
              </h4>
              <ScrollArea className="h-[400px]">
                <AnimatedList delay={100} className="space-y-2">
                  {todo.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="group relative bg-neutral-50 dark:bg-neutral-800 p-2 rounded-md"
                    >
                      <div className="text-neutral-500 dark:text-neutral-400 text-xs">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm dark:text-neutral-300">
                        {comment.comment}
                      </div>

                      {/* Delete button that appears on hover */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(comment.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </AnimatedList>
              </ScrollArea>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddComment}
            size="sm"
            disabled={!newComment.trim() || addTodoComment.isPending}
          >
            {addTodoComment.isPending ? "Adding..." : "Add Comment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
