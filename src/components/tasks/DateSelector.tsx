import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Repeat, Sun, Sunrise, CalendarDays, CalendarPlus } from 'lucide-react';
import { format, addDays, nextSaturday, parse, isValid } from "date-fns";
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
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<Date>(selectedDate || new Date());
  const [parsedDate, setParsedDate] = useState<Date | null>(null);

  const handleQuickSelect = (days: number | Date, buttonId: string) => {
    const date = typeof days === 'number' ? addDays(new Date(), days) : days;
    onSelect(date);
    setInputValue(format(date, "MMM dd, yyyy"));
    setActiveButton(buttonId);
    setDisplayMonth(date);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onSelect(date);
    if (date) {
      setInputValue(format(date, "MMM dd, yyyy"));
    }
    setActiveButton(null);
  };

  const getNextWeekend = () => {
    return nextSaturday(new Date());
  };

  const parseUserInput = (input: string): Date | null => {
    if (!input.trim()) return null;

    const currentYear = new Date().getFullYear();
    const normalizedInput = input.toLowerCase().trim();

    const patterns = [
      { regex: /^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?$/i, format: 'MMM d' },
      { regex: /^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)$/i, format: 'd MMM' },
      { regex: /^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?$/i, format: 'MMMM d' },
      { regex: /^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)$/i, format: 'd MMMM' },
    ];

    for (const { regex, format: dateFormat } of patterns) {
      const match = normalizedInput.match(regex);
      if (match) {
        try {
          const parsedDate = parse(normalizedInput.replace(/(\d+)(st|nd|rd|th)/i, '$1'), dateFormat, new Date());
          if (isValid(parsedDate)) {
            parsedDate.setFullYear(currentYear);
            if (parsedDate < new Date()) {
              parsedDate.setFullYear(currentYear + 1);
            }
            return parsedDate;
          }
        } catch (e) {
          continue;
        }
      }
    }

    return null;
  };

  useEffect(() => {
    const date = parseUserInput(inputValue);
    setParsedDate(date);
    if (date) {
      setDisplayMonth(date);
    }
  }, [inputValue]);

  const handleApplySuggestion = () => {
    if (parsedDate) {
      onSelect(parsedDate);
      setInputValue(format(parsedDate, "MMM dd, yyyy"));
      setActiveButton(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setActiveButton(null);
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
        className="w-[300px] h-[600px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="start"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col h-full">
          {/* Date Input Field */}
          <div className="p-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="type a date"
              className="w-full bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
            />
          </div>

          {/* Suggestion Buttons */}
          {parsedDate && (
            <div className="px-3 pb-3">
              <Button
                onClick={handleApplySuggestion}
                size="sm"
                className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-9 text-sm"
              >
                Apply: {format(parsedDate, "MMM dd, yyyy")}
              </Button>
            </div>
          )}

          {/* Quick Select Buttons */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(0, 'today')}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Sun className={cn(
                "h-3.5 w-3.5 transition-all duration-200",
                activeButton === 'today' && "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
              )} />
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(1, 'tomorrow')}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Sunrise className={cn(
                "h-3.5 w-3.5 transition-all duration-200",
                activeButton === 'tomorrow' && "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
              )} />
              Tomorrow
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(getNextWeekend(), 'weekend')}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              <CalendarDays className={cn(
                "h-3.5 w-3.5 transition-all duration-200",
                activeButton === 'weekend' && "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              )} />
              Next Weekend
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(2, 'afterday')}
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              <CalendarPlus className={cn(
                "h-3.5 w-3.5 transition-all duration-200",
                activeButton === 'afterday' && "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              )} />
              After Day
            </Button>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-auto p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              className="rounded-[8px] transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Time and Repeat Buttons */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2"
            >
              <Clock className="h-3.5 w-3.5" />
              Time
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs flex items-center justify-center gap-2"
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
