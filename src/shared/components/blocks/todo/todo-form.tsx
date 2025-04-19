import { TodoPriorityEnum } from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { priorityOptions } from "./_constants/todo.constant";

import {
  todoFormValidator,
  TodoFormValues,
} from "./_validators/todo-form.validator";

interface AddTodoProps {
  onSubmit: (todo: TodoFormValues) => void;
  onCancelEditing: () => void;
  defaultValues?: TodoFormValues;
}

export const TodoForm: React.FC<AddTodoProps> = ({
  onSubmit,
  onCancelEditing,
  defaultValues,
}) => {
  const form = useForm<TodoFormValues>({
    defaultValues: {
      title: defaultValues?.title || "",
      dueDate: defaultValues?.dueDate || undefined,
      priority: defaultValues?.priority || TodoPriorityEnum.MEDIUM,
    },
    resolver: zodResolver(todoFormValidator),
  });

  const handleSubmit = (data: TodoFormValues) => {
    if (data.title.trim()) {
      onSubmit({
        title: data.title.trim(),
        priority: data.priority,
        dueDate: data.dueDate!,
      });

      // Reset form
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 px-4"
      >
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
                    className="w-full "
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
          <div>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Optional):</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
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
          <Button type="button" variant="outline" onClick={onCancelEditing}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
