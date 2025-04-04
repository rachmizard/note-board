"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

interface DatePickerProps {
  defaultValue?: Date;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
}

export function DatePicker({
  defaultValue,
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [date, setDate] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
