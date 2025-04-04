import React, { useState } from "react";
import { Todo, TodoPriority } from "@/types/todo";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";
import { DatePicker } from "@/shared/components/ui/datepicker";
import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";

interface AddTodoProps {
  onAdd: (
    todo: Omit<Todo, "id" | "createdAt" | "status" | "completedAt">
  ) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityOptions: ComboboxOption[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      onAdd({
        title: title.trim(),
        dueDate: dueDate,
        priority,
      });

      // Reset form
      setTitle("");
      setDueDate(undefined);
      setPriority("medium");
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6 px-4">
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm mb-1">Due Date (Optional):</p>
              <DatePicker
                value={dueDate}
                onChange={(date) => setDueDate(date)}
                placeholder="Select a due date"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Priority:</p>
              <Combobox
                value={priority}
                onChange={(value) => setPriority(value as TodoPriority)}
                options={priorityOptions}
                placeholder="Select priority"
                emptyText="No priority options available"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Todo</Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Todo</span>
        </button>
      )}
    </Card>
  );
};
