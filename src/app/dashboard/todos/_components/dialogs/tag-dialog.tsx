import { TodoWithRelations } from "@/server/database/drizzle/todo.schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { useTags } from "@/shared/hooks/queries";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { PlusIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useAddTodoTag } from "../../_mutations/use-add-todo-tag";
import { useRemoveTodoTag } from "../../_mutations/use-remove-todo-tag";
import { useCreateTag } from "@/shared/hooks/mutations";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoWithRelations;
}

export const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onOpenChange,
  todo,
}) => {
  const [inputValue, setInputValue] = useState("");

  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const addTodoTag = useAddTodoTag();
  const removeTodoTag = useRemoveTodoTag();

  const createTag = useCreateTag();

  const debouncedInputValue = useDebounceValue(inputValue, 500);

  const tagsQuery = useTags(
    {
      type: "todo",
      keyword: debouncedInputValue,
    },
    !!open
  );

  const handleSubmitNewTag: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newTag = tagsQuery.data?.find(
      (tag) => tag.id === Number(selectedTag)
    )?.name;
    if (!newTag) return;

    setSelectedTag(undefined);

    addTodoTag.mutate({
      todoId: todo.id,
      tagId: Number(selectedTag),
      name: newTag,
    });
  };

  const handleSubmitNewTagKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const newTag = inputValue;
      if (!newTag?.trim()) return;

      setInputValue("");

      createTag.mutate({
        name: newTag,
        type: "todo",
      });
    }
  };

  const handleRemoveTag = (tagId: number) => {
    removeTodoTag.mutate({
      todoId: todo.id,
      tagId,
    });
  };

  const handleAddTagButtonClick = (value: string) => {
    createTag.mutate({
      name: value,
      type: "todo",
    });

    setInputValue("");
  };

  const tagOptions =
    tagsQuery.data?.map((tag) => ({
      value: tag.id.toString(),
      label: tag.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <form id="tag-form" onSubmit={handleSubmitNewTag}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tag" className="block text-sm font-medium mb-1">
                New Tag
              </Label>
              <Combobox
                id="tag"
                value={selectedTag}
                onChange={setSelectedTag}
                shouldFilter={false}
                options={tagOptions}
                emptyText="No tags found"
                placeholder="Select tag name or create new"
                inputValue={inputValue}
                onInputValueChange={setInputValue}
                commantInputProps={{
                  onKeyDown: handleSubmitNewTagKeyDown,
                }}
                renderExtraEmptyComponent={(value) => {
                  if (!value) return null;
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTagButtonClick(value)}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add &quot;{value}&quot;
                    </Button>
                  );
                }}
              />
            </div>

            {/* Display existing tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Current Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {todo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.tag?.name ?? "-"}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleRemoveTag(tag.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
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
          <Button
            type="submit"
            size="sm"
            form="tag-form"
            disabled={!selectedTag || addTodoTag.isPending}
          >
            {addTodoTag.isPending ? "Adding..." : "Add Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
