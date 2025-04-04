import React, { useState } from "react";
import { Todo } from "@/types/todo";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo;
  onAddComment: (comment: string) => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onOpenChange,
  todo,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              className="w-full border rounded-md p-2 min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment here..."
            />
          </div>

          {/* Display existing comments */}
          {todo.comments && todo.comments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 dark:text-gray-300">
                Previous Comments
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {todo.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                  >
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm dark:text-gray-300">
                      {comment.text}
                    </div>
                  </div>
                ))}
              </div>
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
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
