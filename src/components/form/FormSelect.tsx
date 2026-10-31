"use client"
import * as React from "react";
import { Controller, Control } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui";

import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
};

type FormSelectProps<T> = {
  name: string;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  onChange?: (value: string) => void;
  debounceTime?: number; // New prop to control debounce duration
};

export function FormSelect<T>({
  name,
  control,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  disabled = false,
  onChange,
  debounceTime = 300,
}: FormSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, debounceTime);

  // Filter options based on debounced search
  const filteredOptions = React.useMemo(() => {
    if (!debouncedSearch) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, options]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = React.useMemo(
          () => options.find((o) => o.value === field.value),
          [field.value, options]
        );

        const handleSelect = (value: string) => {
          field.onChange(value);
          onChange?.(value);
          setOpen(false);
          setSearch(""); // Reset search after selection
        };

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                disabled={disabled}
                className={cn(
                  "w-full justify-between",
                  !selected && "text-muted-foreground"
                )}
              >
                {selected ? selected.label : placeholder}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>

           
              {open && (
                <PopoverContent
                  asChild
                  className="w-full p-0 origin-top-left"
                  align="start"
                  sideOffset={4}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
            
                    <Command>
                      <CommandInput
                        placeholder={searchPlaceholder}
                        autoFocus
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {filteredOptions.map((opt) => (
                            <CommandItem
                              key={opt.value}
                              value={opt.value}
                              onSelect={() => handleSelect(opt.value)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === opt.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {opt.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
              
                </PopoverContent>
              )}
          </Popover>
        );
      }}
    />
  );
}
