// components/ui/date-range-picker.tsx
"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils/";
import { Button } from "@/components/ui/button/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

export interface DateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const currentDateRange = dateRange ?? date;
  const setCurrentDateRange = onDateRangeChange ?? setDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !currentDateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {currentDateRange?.from ? (
              currentDateRange.to ? (
                <>
                  {format(currentDateRange.from, "LLL dd, y")} -{" "}
                  {format(currentDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(currentDateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={currentDateRange?.from}
            selected={currentDateRange}
            onSelect={setCurrentDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
