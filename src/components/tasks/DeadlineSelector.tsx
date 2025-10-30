import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DeadlineSelectorProps {
  selectedDeadline?: string;
  onSelect: (deadline: string | undefined) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

interface CustomDeadlineData {
  value: string;
  label: string;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ selectedDeadline, onSelect, selectedDate, selectedTime }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedDeadline, setTempSelectedDeadline] = useState<string | undefined>(selectedDeadline);
  const [customInput, setCustomInput] = useState('');
  const [parsedDeadline, setParsedDeadline] = useState<string | null>(null);
  const [recentCustomDeadlines, setRecentCustomDeadlines] = useState<CustomDeadlineData[]>(() => {
    const saved = localStorage.getItem('kario-custom-deadlines');
    return saved ? JSON.parse(saved) : [];
  });

  const parseDeadlineInput = (input: string): string | null => {
    if (!input.trim()) return null;

    const normalizedInput = input.toLowerCase().trim();

    const timePatterns = [
      /^(\d{1,2})[:|\ ](\d{1,2})\s*(am|pm)$/i,
      /^(\d{1,2})\s*(am|pm)$/i,
      /^(\d{1,2})[:|\ ](\d{1,2})$/i,
    ];

    for (const pattern of timePatterns) {
      const match = normalizedInput.match(pattern);
      if (match) {
        let hours = parseInt(match[1]);
        let minutes = match[2] && !['am', 'pm'].includes(match[2].toLowerCase()) ? parseInt(match[2]) : 0;
        let period = match[3] || (match[2] && ['am', 'pm'].includes(match[2].toLowerCase()) ? match[2] : null);

        if (period && typeof period === 'string' && (period.toLowerCase() === 'am' || period.toLowerCase() === 'pm')) {
          if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
          } else if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
          }
        }

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          return `at:${time24}`;
        }
      }
    }

    const patterns = [
      { regex: /(\d+)\s*minute/i, unit: 'minutes' },
      { regex: /(\d+)\s*min/i, unit: 'minutes' },
      { regex: /(\d+)\s*hour/i, unit: 'hours' },
      { regex: /(\d+)\s*hr/i, unit: 'hours' },
      { regex: /(\d+)\s*day/i, unit: 'days' },
      { regex: /(\d+)\s*week/i, unit: 'weeks' },
      { regex: /(\d+)\s*month/i, unit: 'months' },
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
    const parsed = parseDeadlineInput(customInput);
    setParsedDeadline(parsed);
  }, [customInput]);

  const handleDeadlineSelect = (value: string) => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    setTempSelectedDeadline(value);
    onSelect(value);
    setOpen(false);
  };

  const handleApplyCustom = () => {
    if (parsedDeadline && selectedDate && selectedTime) {
      const newCustomDeadline: CustomDeadlineData = {
        value: parsedDeadline,
        label: getDisplayLabel(parsedDeadline)
      };

      const updatedRecents = [newCustomDeadline, ...recentCustomDeadlines.filter(d => d.value !== parsedDeadline)].slice(0, 10);
      setRecentCustomDeadlines(updatedRecents);
      localStorage.setItem('kario-custom-deadlines', JSON.stringify(updatedRecents));

      setTempSelectedDeadline(parsedDeadline);
      onSelect(parsedDeadline);
      setCustomInput('');
      setParsedDeadline(null);
      setOpen(false);
    }
  };

  const handleDeleteCustomDeadline = (deadlineValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedRecents = recentCustomDeadlines.filter(d => d.value !== deadlineValue);
    setRecentCustomDeadlines(updatedRecents);
    localStorage.setItem('kario-custom-deadlines', JSON.stringify(updatedRecents));
  };

  const handleClearDeadline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempSelectedDeadline(undefined);
    onSelect(undefined);
    setOpen(false);
  };

  const getDisplayLabel = (value: string | undefined) => {
    if (!value) return 'Deadline';

    if (value === 'end-of-day') {
      return 'End of day';
    }

    if (value.startsWith('at:')) {
      const time24 = value.substring(3);
      const [hours24Str, minutes] = time24.split(':');
      const hours24 = parseInt(hours24Str);
      const displayHours = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
      const displayPeriod = hours24 >= 12 ? 'PM' : 'AM';
      return `${displayHours}:${minutes} ${displayPeriod}`;
    }

    const match = value.match(/^(\d+)([mhdw])/);
    if (match) {
      const num = match[1];
      const unit = match[2];
      const unitMap: Record<string, string> = {
        'm': 'min',
        'h': 'hour',
        'd': 'day',
        'w': 'week',
      };
      return `${num} ${unitMap[unit]}${parseInt(num) > 1 ? 's' : ''}`;
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
            tempSelectedDeadline && "text-white border-[#252232] bg-[#1e1e1f] rounded-[8px]"
          )}
        >
          <Clock className="h-4 w-4 mr-2" />
          {getDisplayLabel(tempSelectedDeadline)}
          {tempSelectedDeadline && (
            <X
              className="h-3 w-3 ml-2 hover:text-red-400"
              onClick={handleClearDeadline}
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
              placeholder="e.g., 5pm, 2 hours, 3 days"
              className="w-full bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
              disabled={!selectedDate || !selectedTime}
            />
            {(!selectedDate || !selectedTime) && (
              <p className="text-xs text-gray-500 mt-1">
                {!selectedDate ? 'Please select a date first' : 'Please select a time first'}
              </p>
            )}
          </div>

          {parsedDeadline && selectedDate && selectedTime && (
            <div className="px-3 pb-3">
              <Button
                onClick={handleApplyCustom}
                size="sm"
                className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-9 text-sm"
              >
                Apply: {getDisplayLabel(parsedDeadline)}
              </Button>
            </div>
          )}

          {recentCustomDeadlines.length > 0 && (
            <div className="px-3 pb-3 space-y-2">
              <div className="text-xs text-gray-500 mb-2">Recent Custom</div>
              {recentCustomDeadlines.map((customDead, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeadlineSelect(customDead.value)}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {customDead.label}
                  </Button>
                  <button
                    onClick={(e) => handleDeleteCustomDeadline(customDead.value, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-md"
                  >
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 space-y-2">
            {recentCustomDeadlines.length > 0 && (
              <div className="text-xs text-gray-500 mb-2">Preset Deadlines</div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('end-of-day')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              End of day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('at:17:00')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              5:00 PM
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('at:18:00')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              6:00 PM
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('2h')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              In 2 hours
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('1d')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              In 1 day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeadlineSelect('3d')}
              disabled={!selectedDate || !selectedTime}
              className="w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-2" />
              In 3 days
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeadlineSelector;
