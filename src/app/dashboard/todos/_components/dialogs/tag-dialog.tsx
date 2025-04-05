import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Todo } from "@/types/todo";
import { X } from "lucide-react";
import React, { useRef } from "react";
import { useAddTodoTag } from "../../_mutations/use-add-todo-tag";
import { Label } from "@/shared/components/ui/label";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo;
}

export const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onOpenChange,
  todo,
}) => {
  const inputTagRef = useRef<HTMLInputElement>(null);

  const addTodoTag = useAddTodoTag();

  const handleAddTag: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newTag = inputTagRef.current?.value ?? e.currentTarget.tag.value;
    if (!newTag?.trim()) return;

    if (!inputTagRef.current) return;
    inputTagRef.current.focus();
    inputTagRef.current.select();
    inputTagRef.current.value = "";

    addTodoTag.mutate({
      todoId: Number(todo.id),
      name: newTag,
    });
  };

  const handleRemoveTag = (tagId: number) => {
    console.log(tagId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <form id="tag-form" onSubmit={handleAddTag}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tag" className="block text-sm font-medium mb-1">
                New Tag
              </Label>
              <Input
                id="tag"
                ref={inputTagRef}
                name="tag"
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
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm cursor-pointer"
                      role="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleRemoveTag(tag.id);
                      }}
                      tabIndex={0}
                    >
                      {tag.name}
                      <button
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();

                          handleRemoveTag(tag.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" form="tag-form">
            Add Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
