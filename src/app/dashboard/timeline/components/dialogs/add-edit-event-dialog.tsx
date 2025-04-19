"use client";

import { useForm } from "react-hook-form";
import {
  format,
  getHours,
  getMinutes,
  set,
  isBefore,
  addHours,
} from "date-fns";

import { useDisclosure } from "@/app/dashboard/timeline/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { eventSchema, TEventFormData } from "@/app/dashboard/timeline/schemas";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { ReactNode, useEffect } from "react";
import { IEvent } from "@/app/dashboard/timeline/interfaces";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "@/shared/components/ui/date-time-picker";
import { cn } from "@/shared/lib/utils";

interface IProps {
  children: ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  event?: IEvent;
}

// Color mapping for background and border styles
const colorStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-500",
    text: "text-green-600 dark:text-green-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    border: "border-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-500",
    text: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-500",
    text: "text-orange-600 dark:text-orange-400",
  },
};

// Color dot style mapping
const colorDotStyles: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
};

// Color button component
interface ColorButtonProps {
  color: string;
  fieldValue: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

function ColorButton({
  color,
  fieldValue,
  onChange,
  isInvalid,
}: ColorButtonProps) {
  const isSelected = fieldValue === color;
  const styles = colorStyles[color];

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "gap-1.5 py-1.5 px-3 border capitalize h-11 w-full justify-center",
        isSelected && `${styles.bg} ${styles.border} ${styles.text}`,
        !isSelected && "hover:bg-muted",
        isInvalid && "border-red-500"
      )}
      onClick={() => onChange(color)}
    >
      <div
        className="size-3 rounded-full mr-1.5"
        style={{ backgroundColor: colorDotStyles[color] }}
      />
      {color}
    </Button>
  );
}

export function AddEditEventDialog({
  children,
  startDate,
  startTime,
  event,
}: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!event;

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          startDate: set(new Date(event.startDate), {
            hours: getHours(event.startDate),
            minutes: getMinutes(event.endDate),
          }),
          endDate: set(new Date(event.endDate), {
            hours: getHours(event.endDate),
            minutes: getMinutes(event.endDate),
          }),
          color: event.color,
        }
      : {
          title: "",
          description: "",
          startDate: startDate
            ? set(new Date(startDate), {
                hours: startTime?.hour || new Date().getHours(),
                minutes: startTime?.minute || 0,
              })
            : new Date(),

          endDate: startDate
            ? set(new Date(startDate), {
                hours: (startTime?.hour || new Date().getHours()) + 1,
                minutes: startTime?.minute || 0,
              })
            : set(new Date(), { hours: new Date().getHours() + 1 }),
          color: "blue" as const,
        },
  });

  // Watch for changes to startDate to adjust endDate if needed
  const currentStartDate = form.watch("startDate");
  const currentEndDate = form.watch("endDate");

  useEffect(() => {
    // If end date is before start date, automatically set it to 1 hour after start
    if (
      currentEndDate &&
      currentStartDate &&
      isBefore(currentEndDate, currentStartDate)
    ) {
      form.setValue("endDate", addHours(new Date(currentStartDate), 1));
    }
  }, [currentStartDate, currentEndDate, form]);

  const onSubmit = (values: TEventFormData) => {
    try {
      // Additional validation to ensure end date is after start date
      if (isBefore(values.endDate, values.startDate)) {
        form.setError("endDate", {
          type: "manual",
          message: "End date must be after start date",
        });
        return;
      }

      const formattedEvent: IEvent = {
        ...values,
        startDate: format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        id: isEditing ? event.id : Math.floor(Math.random() * 1000000),
        user: isEditing
          ? event.user
          : {
              id: Math.floor(Math.random() * 1000000).toString(),
              name: "John Doe",
              picturePath: null,
            },
        color: values.color,
      };

      if (isEditing) {
        updateEvent(formattedEvent);
        toast.success("Event updated successfully");
      } else {
        addEvent(formattedEvent);
        toast.success("Event created successfully");
      }

      onClose();
      form.reset();
    } catch (error) {
      console.error(`Error ${isEditing ? "editing" : "adding"} event:`, error);
      toast.error(`Failed to ${isEditing ? "edit" : "add"} event`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify your existing event."
              : "Create a new event for your calendar."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="required">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a description"
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker
                  form={form}
                  field={field}
                  dateFormat="MMM d, yyyy HH:mm"
                />
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker
                  form={form}
                  field={field}
                  dateFormat="MMM d, yyyy HH:mm"
                  minDate={form.getValues("startDate")}
                />
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Variant</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2 mx-auto w-full max-w-md">
                      {/* First row */}
                      <ColorButton
                        color="blue"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                      <ColorButton
                        color="green"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                      <ColorButton
                        color="red"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />

                      {/* Second row */}
                      <ColorButton
                        color="yellow"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                      <ColorButton
                        color="orange"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                      <ColorButton
                        color="purple"
                        fieldValue={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button form="event-form" type="submit">
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
