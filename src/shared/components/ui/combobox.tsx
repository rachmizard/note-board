"use client";

import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";
import * as React from "react";

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
import { cn } from "@/shared/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

export interface ComboboxOption {
  value: string;
  label: string;
}

type OmmitedProps = "value" | "onChange" | "defaultValue";

type ComboboxPropsWithoutOmmitedProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  OmmitedProps
>;
export interface ComboboxProps extends ComboboxPropsWithoutOmmitedProps {
  value?: string;
  onChange?: (value: string) => void;
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
  renderExtraEmptyComponent?: (inputValue: string) => React.ReactNode;
  id?: string;
  commantInputProps?: React.ComponentProps<typeof CommandInput>;
  shouldFilter?: boolean;
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
  id,
  className,
  renderExtraEmptyComponent,
  commantInputProps,
  shouldFilter = false,
  ...props
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
    <Popover open={_open} onOpenChange={_setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={_open}
          className={cn(
            "w-full justify-between",
            !selectedValue && "text-muted-foreground",
            className
          )}
          {...props}
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label ||
              placeholder
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[20rem] p-0" align="start">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            id={id}
            placeholder={placeholder}
            className="h-9"
            value={_inputValue}
            onValueChange={_setInputValue}
            {...commantInputProps}
          />
          <CommandList>
            <CommandEmpty className="flex flex-col gap-4 justify-center items-center py-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4" />
                {emptyText}
              </div>
              {renderExtraEmptyComponent &&
                renderExtraEmptyComponent(_inputValue ?? "")}
            </CommandEmpty>
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
