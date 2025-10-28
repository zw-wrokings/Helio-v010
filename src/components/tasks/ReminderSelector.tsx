import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ReminderSelectorProps {
  selectedReminder?: string;
  onSelect: (reminder: string | undefined) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const ReminderSelector: React.FC<ReminderSelectorProps> = ({ selectedReminder, onSelect, selectedDate, selectedTime }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedReminder, setTempSelectedReminder] = useState<string | undefined>(selectedReminder);
  const [customInput, setCustomInput] = useState('');
  const [parsedReminder, setParsedReminder] = useState<string | null>(null);

  const parseReminderInput = (input: string): string | null => {
    if (!input.trim()) return null;

    const normalizedInput = input.toLowerCase().trim();

    const patterns = [
      { regex: /(\d+)\s*minute/i, unit: 'minutes' },
      { regex: /(\d+)\s*min/i, unit: 'minutes' },
      { regex: /(\d+)\s*hour/i, unit: 'hours' },
      { regex: /(\d+)\s*hr/i, unit: 'hours' },
      { regex: /(\d+)\s*day/i, unit: 'days' },
      { regex: /(\d+)\s*week/i, unit: 'weeks' },
      { regex: /(\d+)\s*month/i, unit: 'months' },
      { regex: /(\d+)\s*second/i, unit: 'seconds' },
      { regex: /(\d+)\s*sec/i, unit: 'seconds' },
    ];

    for (const { regex, unit } of patterns) {
      const match = normalizedInput.match(regex);
      if (match) {
        const value = match[1];
        return `${value}${unit.charAt(0)}`;
      }
    }

    return null;
  };

  useEffect(() => {
    const parsed = parseReminderInput(customInput);
    setParsedReminder(parsed);
  }, [customInput]);

  const handleReminderSelect = (value: string) => {
    if (!selectedDate) {
      return;
    }
    setTempSelectedReminder(value);
    onSelect(value);
    setOpen(false);
  };

  const handleApplyCustom = () => {
    if (parsedReminder && selectedDate) {
      setTempSelectedReminder(parsedReminder);
      onSelect(parsedReminder);
      setOpen(false);
    }
  };

  const handleClearReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempSelectedReminder(undefined);
    onSelect(undefined);
    setOpen(false);
  };

  const getDisplayLabel = (value: string | undefined) => {
    if (!value) return 'Reminder';

    if (value === 'at-time') {
      return 'At time of task';
    }

    const match = value.match(/^(\d+)([mhdws])/);
    if (match) {
      const num = match[1];
      const unit = match[2];
      const unitMap: Record<string, string> = {
        'm': 'min',
        'h': 'hour',
        'd': 'day',
        'w': 'week',
        's': 'sec',
      };
      return `${num} ${unitMap[unit]}${parseInt(num) > 1 ? 's' : ''} before`;
    }

    return value;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-400 hover:text-white hover:border hover:border-[#252232] hover:bg-[#1e1e1f] hover:rounded-[8px] px-3 py-1 h-8 whitespace-nowrap transition-all duration-200 border border-transparent relative",
            tempSelectedReminder && "text-white border-[#252232] bg-[#1e1e1f] rounded-[8px]"
          )}
        >
          <Bell className="h-4 w-4 mr-2" />
          {getDisplayLabel(tempSelectedReminder)}
          {tempSelectedReminder && (
            <X
              className="h-3 w-3 ml-2 hover:text-red-400"
              onClick={handleClearReminder}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="start"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col">
          <div className="p-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="type reminder (e.g., 10 minutes, 2 hours)"
              className="w-full bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
              disabled={!selectedDate}
            />
            {!selectedDate && (
              <p className="text-xs text-gray-500 mt-1">Please select a date first</p>
            )}
          </div>

          {parsedReminder && selectedDate && (
            <div className="px-3 pb-3">
              <Button
                onClick={handleApplyCustom}
                size="sm"
                className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-9 text-sm"
              >
                Apply: {getDisplayLabel(parsedReminder)}
              </Button>
            </div>
          )}

          <div className="p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReminderSelect('at-time')}
              disabled={!selectedDate}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell className="h-4 w-4 mr-2" />
              At the time of the tasks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReminderSelect('10m')}
              disabled={!selectedDate}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell className="h-4 w-4 mr-2" />
              10 minutes before
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReminderSelect('30m')}
              disabled={!selectedDate}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell className="h-4 w-4 mr-2" />
              30 minutes before
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReminderSelect('1h')}
              disabled={!selectedDate}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell className="h-4 w-4 mr-2" />
              1 hour before
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReminderSelector;
