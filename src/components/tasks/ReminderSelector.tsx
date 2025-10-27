import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ReminderSelectorProps {
  selectedReminder?: string;
  onSelect: (reminder: string | undefined) => void;
}

const ReminderSelector: React.FC<ReminderSelectorProps> = ({ selectedReminder, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedReminder, setTempSelectedReminder] = useState<string | undefined>(selectedReminder);

  const reminderOptions = [
    { label: '5 minutes before', value: '5min' },
    { label: '10 minutes before', value: '10min' },
    { label: '15 minutes before', value: '15min' },
    { label: '30 minutes before', value: '30min' },
    { label: '1 hour before', value: '1hour' },
    { label: '2 hours before', value: '2hours' },
    { label: '1 day before', value: '1day' },
    { label: '2 days before', value: '2days' },
    { label: '1 week before', value: '1week' },
  ];

  const handleReminderSelect = (value: string) => {
    setTempSelectedReminder(value);
    onSelect(value);
    setOpen(false);
  };

  const handleClearReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempSelectedReminder(undefined);
    onSelect(undefined);
    setOpen(false);
  };

  const getDisplayLabel = (value: string | undefined) => {
    if (!value) return 'Reminder';
    const option = reminderOptions.find(opt => opt.value === value);
    return option ? option.label : 'Reminder';
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
        className="w-64 p-0 bg-[#1b1b1b] border border-[#414141] rounded-[15px] z-50"
        align="start"
      >
        <div className="p-3 space-y-2">
          <div className="text-xs text-gray-500 mb-2">Set Reminder</div>
          {reminderOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => handleReminderSelect(option.value)}
              className={cn(
                "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200",
                tempSelectedReminder === option.value
                  ? 'bg-[#2e2e2e] text-white'
                  : 'bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white'
              )}
            >
              <Bell className="h-4 w-4 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReminderSelector;
