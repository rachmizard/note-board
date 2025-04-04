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
import { Input } from "@/shared/components/ui/input";
import { X } from "lucide-react";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onOpenChange,
  todo,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onAddTag(newTag);
    setNewTag("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Tag
            </label>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full"
              placeholder="Enter tag name"
            />
          </div>

          {/* Display existing tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Tags</h4>
              <div className="flex flex-wrap gap-2">
                {todo.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => onRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
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
          <Button onClick={handleAddTag} size="sm" disabled={!newTag.trim()}>
            Add Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
