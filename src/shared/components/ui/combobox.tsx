"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  options: ComboboxOption[];
  defaultInputValue?: string;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  emptyText?: string;
}

export function Combobox({
  value,
  onChange,
  placeholder = "Select an option",
  defaultValue,
  options,
  defaultInputValue,
  inputValue,
  onInputValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  emptyText = "No options found",
}: ComboboxProps) {
  const [_open, _setOpen] = useControllableState({
    defaultProp: defaultOpen,
    prop: open,
    onChange: onOpenChange,
  });

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });

  const [_inputValue, _setInputValue] = useControllableState({
    defaultProp: defaultInputValue,
    prop: inputValue,
    onChange: onInputValueChange,
  });

  return (
    <Popover open={_open} onOpenChange={_setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={_open}
          className="w-full justify-between"
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            value={_inputValue}
            onValueChange={_setInputValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedValue(
                      currentValue === selectedValue ? "" : currentValue
                    );
                    _setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
