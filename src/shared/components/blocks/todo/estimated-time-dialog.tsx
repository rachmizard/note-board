import { TodoWithRelations } from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EstimatedTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoWithRelations;
  onSave: (hours: number, minutes: number, seconds: number) => void;
}

// Create a validator for time inputs with string coercion
const timeFormSchema = z.object({
  hours: z.coerce.number().min(0).max(999),
  minutes: z.coerce.number().min(0).max(59),
  seconds: z.coerce.number().min(0).max(59),
  includeSeconds: z.boolean(),
});

type EstimtedTimeFormValues = z.infer<typeof timeFormSchema>;

export const EstimatedTimeDialog: React.FC<EstimatedTimeDialogProps> = ({
  open,
  onOpenChange,
  todo,
  onSave,
}) => {
  // Initialize form with React Hook Form
  const form = useForm<EstimtedTimeFormValues>({
    resolver: zodResolver(timeFormSchema),
    defaultValues: {
      hours: 0,
      minutes: 0,
      seconds: 0,
      includeSeconds: false,
    },
  });

  // Parse and set initial values from todo's estimated time if it exists
  useEffect(() => {
    try {
      if (!todo) return;
      const includeSeconds = todo.estimatedSeconds! > 0;

      form.reset({
        hours: todo.estimatedHours!,
        minutes: todo.estimatedMinutes!,
        seconds: todo.estimatedSeconds!,
        includeSeconds,
      });
    } catch (error) {
      console.error("Error parsing estimatedTime:", error);
    }
  }, [
    todo.estimatedHours,
    todo.estimatedMinutes,
    todo.estimatedSeconds,
    form,
    open,
    todo,
  ]);

  const handleSubmit = ({
    hours,
    minutes,
    seconds,
  }: EstimtedTimeFormValues) => {
    onSave(hours, minutes, seconds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Estimated Time</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Set the estimated time for the todo.
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="includeSeconds"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="include-seconds"
                    />
                  </FormControl>
                  <FormLabel htmlFor="include-seconds">
                    Include seconds
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col h-[80px]">
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Hours"
                        {...field}
                        className="w-full"
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          if (e.target.value === "") {
                            e.target.value = "0";
                            field.onChange(0);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="h-5 mt-1">
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col h-[80px]">
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Minutes"
                        {...field}
                        className="w-full"
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          if (e.target.value === "") {
                            e.target.value = "0";
                            field.onChange(0);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="h-5 mt-1">
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("includeSeconds") && (
                <FormField
                  control={form.control}
                  name="seconds"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col h-[80px]">
                      <FormLabel>Seconds</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Seconds"
                          {...field}
                          className="w-full"
                          onFocus={(e) => {
                            if (e.target.value === "0") {
                              e.target.value = "";
                            }
                          }}
                          onBlur={(e) => {
                            field.onBlur();
                            if (e.target.value === "") {
                              e.target.value = "0";
                              field.onChange(0);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="h-5 mt-1">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                size="sm"
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Time
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
