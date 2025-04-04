import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Combobox } from "@/shared/components/ui/combobox";
import { DatePicker } from "@/shared/components/ui/datepicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { TodoPriorityEnum } from "@/server/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { priorityOptions } from "../_constants/todo.constant";

import {
  createTodoFormValidator,
  CreateTodoFormValues,
} from "../_validators/create-todo.validator";

interface AddTodoProps {
  onAdd: (todo: CreateTodoFormValues) => void;
}

type FormValues = {
  title: string;
  dueDate?: Date;
  priority: TodoPriorityEnum;
};

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<CreateTodoFormValues>({
    defaultValues: {
      title: "",
      dueDate: undefined,
      priority: TodoPriorityEnum.MEDIUM,
    },
    resolver: zodResolver(createTodoFormValidator),
  });

  const onSubmit = (data: FormValues) => {
    if (data.title.trim()) {
      onAdd({
        title: data.title.trim(),
        priority: data.priority,
        dueDate: data.dueDate!,
      });

      // Reset form
      form.reset();
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6 px-4">
      {isExpanded ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="What needs to be done?"
                        className="w-full"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date (Optional):</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          options={priorityOptions}
                          placeholder="Select priority"
                          emptyText="No priority options available"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
        </Form>
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
