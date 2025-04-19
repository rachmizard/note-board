import type { TEventFormData } from "@/app/dashboard/timeline/schemas";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { addMinutes, differenceInMinutes, format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

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
    const value = e.target.value;

    // Handle backspace to empty state
    if (value === "") {
      updateTime(0, field.value?.getMinutes() || 0);
      return;
    }

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    // For single digits or valid two-digit hours
    const numValue = parseInt(value, 10);

    // Only update if it's a valid hour (0-23)
    if (numValue >= 0 && numValue <= 23) {
      updateTime(numValue, field.value?.getMinutes() || 0);
    }
  }

  function handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    // Handle backspace to empty state
    if (value === "") {
      updateTime(field.value?.getHours() || 0, 0);
      return;
    }

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    // For single digits or valid two-digit minutes
    const numValue = parseInt(value, 10);

    // Only update if it's a valid minute (0-59)
    if (numValue >= 0 && numValue <= 59) {
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
                    !field.value && "text-muted-foreground",
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
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="relative flex-1 flex items-center">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-center font-medium"
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
              <span className="absolute right-2 text-xs text-muted-foreground">
                h
              </span>
            </div>

            <span className="text-lg font-medium">:</span>

            {/* Minutes */}
            <div className="relative flex-1 flex items-center">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-center font-medium"
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
              <span className="absolute right-2 text-xs text-muted-foreground">
                m
              </span>
            </div>
          </div>

          {/* Duration selection for end time */}
          {isEndDate && (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-xs"
                    size="sm"
                  >
                    <span>{getDuration() || "Select duration"}</span>
                    <span className="text-muted-foreground">⏱️</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="start">
                  <div className="grid grid-cols-2 gap-1">
                    {durationOptions.map((option) => {
                      const startDate = form.getValues("startDate");
                      const endTime = startDate
                        ? format(
                            addMinutes(new Date(startDate), option.minutes),
                            "HH:mm",
                          )
                        : "";
                      const isSelected = getDuration() === option.label;

                      return (
                        <Button
                          key={option.minutes}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "justify-start px-3 py-2",
                            isSelected && "font-medium",
                          )}
                          onClick={() => selectDuration(option.minutes)}
                        >
                          <div className="flex flex-col items-start text-left">
                            <span className="text-xs">{option.label}</span>
                            <span className="text-[10px] text-muted-foreground">
                              ends at {endTime}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckIcon className="ml-auto h-3 w-3" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
