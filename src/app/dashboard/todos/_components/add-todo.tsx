import React, { useState } from "react";
import { Todo, TodoPriority } from "@/types/todo";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";

interface AddTodoProps {
  onAdd: (
    todo: Omit<Todo, "id" | "createdAt" | "status" | "completedAt">
  ) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      onAdd({
        title: title.trim(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      });

      // Reset form
      setTitle("");
      setDueDate("");
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
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Priority:</p>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
