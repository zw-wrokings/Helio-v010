import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Repeat } from 'lucide-react';
import { format, addDays, nextSaturday } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""
  );

  const handleQuickSelect = (days: number | Date) => {
    const date = typeof days === 'number' ? addDays(new Date(), days) : days;
    onSelect(date);
    setInputValue(format(date, "MMM dd, yyyy"));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onSelect(date);
    if (date) {
      setInputValue(format(date, "MMM dd, yyyy"));
    }
  };

  const getNextWeekend = () => {
    return nextSaturday(new Date());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-400 hover:text-white hover:border hover:border-[#252232] hover:bg-[#1e1e1f] hover:rounded-[8px] px-3 py-1 h-8 whitespace-nowrap transition-all duration-200 border border-transparent",
            !selectedDate && "text-gray-400"
          )}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {selectedDate ? format(selectedDate, "MMM dd") : "Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] h-[600px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="center"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col h-full">
          {/* Date Input Field */}
          <div className="p-3">
            <div className="w-full text-gray-400 text-sm px-3 py-2">
              {inputValue || "Select a date"}
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(0)}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(1)}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs"
            >
              Tomorrow
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(getNextWeekend())}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs"
            >
              Next Weekend
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(2)}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs"
            >
              After Day
            </Button>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-auto px-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              className="rounded-[8px]"
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={2100}
            />
          </div>

          {/* Time and Repeat Buttons */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs flex items-center justify-center gap-2"
            >
              <Clock className="h-3.5 w-3.5" />
              Time
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[8px] h-9 text-xs flex items-center justify-center gap-2"
            >
              <Repeat className="h-3.5 w-3.5" />
              Repeat
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
