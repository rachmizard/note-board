import { format, differenceInMinutes, addMinutes } from "date-fns";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import { CalendarIcon, CheckIcon } from "lucide-react";
import type { TEventFormData } from "@/app/dashboard/timeline/schemas";

interface DatePickerProps {
  form: UseFormReturn<TEventFormData>;
  field: ControllerRenderProps<TEventFormData, "endDate" | "startDate">;
  minDate?: Date;
}

export function DateTimePicker({ form, field, minDate }: DatePickerProps) {
  const isEndDate = field.name === "endDate";

  // Duration options for end time selection
  const durationOptions = [
    { minutes: 30, label: "30 minutes" },
    { minutes: 60, label: "1 hour" },
    { minutes: 90, label: "1,5 hours" },
    { minutes: 120, label: "2 hours" },
    { minutes: 150, label: "2,5 hours" },
    { minutes: 180, label: "3 hours" },
  ];

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      // When selecting a date, preserve the current time
      const currentValue = field.value || new Date();
      const newDate = new Date(date);
      newDate.setHours(currentValue.getHours());
      newDate.setMinutes(currentValue.getMinutes());

      form.setValue(field.name, newDate);
    }
  }

  function updateTime(hours: number, minutes: number) {
    const currentDate = form.getValues(field.name) || new Date();
    const newDate = new Date(currentDate);

    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    form.setValue(field.name, newDate);
  }

  function incrementHour() {
    if (!field.value) return;
    const newHour = (field.value.getHours() + 1) % 24;
    updateTime(newHour, field.value.getMinutes());
  }

  function decrementHour() {
    if (!field.value) return;
    const newHour = (field.value.getHours() - 1 + 24) % 24;
    updateTime(newHour, field.value.getMinutes());
  }

  function incrementMinute() {
    if (!field.value) return;
    const newMinute = (field.value.getMinutes() + 1) % 60;
    updateTime(field.value.getHours(), newMinute);
  }

  function decrementMinute() {
    if (!field.value) return;
    const newMinute = (field.value.getMinutes() - 1 + 60) % 60;
    updateTime(field.value.getHours(), newMinute);
  }

  function handleHourChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    // Only allow numeric input
    if (!/^\d+$/.test(value) && value !== "") return;

    // Handle backspace to empty state
    if (value === "") {
      e.target.value = "00";
      updateTime(0, field.value?.getMinutes() || 0);
      return;
    }

    const numValue = parseInt(value, 10);

    // Validate hour range (00-23)
    if (numValue >= 0 && numValue <= 23) {
      // Pad single digit with leading zero
      if (value.length === 1) {
        value = value.padStart(2, "0");
        e.target.value = value;
      }
      updateTime(numValue, field.value?.getMinutes() || 0);
    }
  }

  function handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    // Only allow numeric input
    if (!/^\d+$/.test(value) && value !== "") return;

    // Handle backspace to empty state
    if (value === "") {
      e.target.value = "00";
      updateTime(field.value?.getHours() || 0, 0);
      return;
    }

    const numValue = parseInt(value, 10);

    // Validate minute range (00-59)
    if (numValue >= 0 && numValue <= 59) {
      // Pad single digit with leading zero
      if (value.length === 1) {
        value = value.padStart(2, "0");
        e.target.value = value;
      }
      updateTime(field.value?.getHours() || 0, numValue);
    }
  }

  function selectDuration(minutes: number) {
    const startDate = form.getValues("startDate");
    if (startDate) {
      const endDate = addMinutes(new Date(startDate), minutes);
      form.setValue("endDate", endDate);
    }
  }

  // Get formatted time for display
  const getHours = () => {
    if (!field.value) return "";
    return field.value.getHours().toString().padStart(2, "0");
  };

  const getMinutes = () => {
    if (!field.value) return "";
    return field.value.getMinutes().toString().padStart(2, "0");
  };

  // Calculate duration from start date for end date field
  const getDuration = () => {
    if (isEndDate && field.value) {
      const startDate = form.getValues("startDate");
      if (startDate) {
        const diffMinutes = differenceInMinutes(field.value, startDate);
        if (diffMinutes < 60) {
          return `${diffMinutes} minutes`;
        } else {
          const hours = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          if (minutes === 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}`;
          } else {
            return `${hours},${minutes === 30 ? "5" : minutes} hours`;
          }
        }
      }
    }
    return null;
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{isEndDate ? "End Date" : "Start Date"}</FormLabel>
      <div className="flex gap-2">
        {/* Date Picker */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={handleDateSelect}
                disabled={minDate ? { before: minDate } : undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-1">
            {/* Hours */}
            <div className="relative flex-1 flex items-center">
              <Input
                className="text-center"
                value={getHours()}
                onChange={handleHourChange}
                maxLength={2}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    incrementHour();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    decrementHour();
                  }
                }}
              />
            </div>

            <span className="text-lg font-medium">:</span>

            {/* Minutes */}
            <div className="relative flex-1 flex items-center">
              <Input
                className="text-center"
                value={getMinutes()}
                onChange={handleMinuteChange}
                maxLength={2}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    incrementMinute();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    decrementMinute();
                  }
                }}
              />
            </div>
          </div>

          {/* Duration selection for end time */}
          {isEndDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-1 w-full justify-start text-xs"
                  size="sm"
                >
                  {getDuration() || "Select duration"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <div className="flex flex-col py-1.5">
                  {durationOptions.map((option) => {
                    const startDate = form.getValues("startDate");
                    const endTime = startDate
                      ? format(
                          addMinutes(new Date(startDate), option.minutes),
                          "HH.mm"
                        )
                      : "";

                    return (
                      <Button
                        key={option.minutes}
                        variant="ghost"
                        className="flex w-full justify-between px-3 py-1.5 text-left"
                        onClick={() => selectDuration(option.minutes)}
                      >
                        <div className="flex items-center">
                          {endTime} {option.label}
                        </div>
                        {getDuration() === option.label && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
