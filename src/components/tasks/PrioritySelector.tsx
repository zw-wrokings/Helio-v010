import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Flag } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  selectedPriority: string;
  onSelect: (priority: string) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ selectedPriority, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedPriority, setTempSelectedPriority] = useState<string>(selectedPriority);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [customPriority, setCustomPriority] = useState<string | null>(null);

  const priorities = [
    { level: 1, color: 'text-red-500' },
    { level: 2, color: 'text-orange-500' },
    { level: 3, color: 'text-yellow-500' },
    { level: 4, color: 'text-green-500' },
    { level: 5, color: 'text-blue-500' },
    { level: 6, color: 'text-purple-500' }
  ];

  const getRandomSaveMessage = () => {
    const messages = [
      'save?',
      'looks good?',
      'confirm?',
      'this one?',
      'lock it in?',
      'keep this?',
      'done?',
      'all set?'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handlePrioritySelect = (priority: string) => {
    setTempSelectedPriority(priority);
    setShowConfirmation(true);
  };

  const handleConfirmPriority = () => {
    onSelect(tempSelectedPriority);
    setShowConfirmation(false);
    setOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    if (priority.startsWith('Priority ')) {
      const level = parseInt(priority.replace('Priority ', ''));
      const priorityData = priorities.find(p => p.level === level);
      return priorityData?.color || 'text-gray-400';
    }
    return 'text-gray-400';
  };

  const getPriorityBg = (priority: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white';

    if (priority.startsWith('Priority ')) {
      const level = parseInt(priority.replace('Priority ', ''));
      switch (level) {
        case 1:
          return 'bg-red-500/20 text-red-400 hover:bg-red-500/20';
        case 2:
          return 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/20';
        case 3:
          return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20';
        case 4:
          return 'bg-green-500/20 text-green-400 hover:bg-green-500/20';
        case 5:
          return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/20';
        case 6:
          return 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/20';
        default:
          return 'bg-[#252525] text-gray-300';
      }
    }
    return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/20';
  };

  useEffect(() => {
    if (inputValue.trim() && inputValue.length <= 20) {
      setCustomPriority(inputValue.trim());
    } else {
      setCustomPriority(null);
    }
  }, [inputValue]);

  const handleApplyCustom = () => {
    if (customPriority) {
      setTempSelectedPriority(customPriority);
      setInputValue('');
      setCustomPriority(null);
      setShowConfirmation(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setInputValue(value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:border hover:border-[#252232] hover:bg-[#1e1e1f] hover:rounded-[8px] px-3 py-1 h-8 whitespace-nowrap transition-all duration-200 border border-transparent"
        >
          <Flag className={cn("h-4 w-4 mr-2", getPriorityColor(selectedPriority))} />
          <span className={getPriorityColor(selectedPriority)}>{selectedPriority}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="start"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Input Field */}
          <div className="p-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="type custom priority"
              className="w-full bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
              maxLength={20}
            />
          </div>

          {/* Custom Priority Apply Button */}
          {customPriority && (
            <div className="px-3 pb-3">
              <Button
                onClick={handleApplyCustom}
                size="sm"
                className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-9 text-sm"
              >
                Apply: {customPriority}
              </Button>
            </div>
          )}

          {/* Priority Options */}
          <div className="p-3 space-y-2">
            {priorities.map((priority) => (
              <Button
                key={priority.level}
                variant="ghost"
                size="sm"
                onClick={() => handlePrioritySelect(`Priority ${priority.level}`)}
                className={cn(
                  "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs flex items-center gap-2 transition-all duration-200",
                  getPriorityBg(`Priority ${priority.level}`, tempSelectedPriority === `Priority ${priority.level}`)
                )}
              >
                <Flag className={`h-4 w-4 ${priority.color}`} />
                Priority {priority.level}
              </Button>
            ))}
          </div>

          {/* Confirmation */}
          {showConfirmation && (
            <div className="p-3 text-center">
              <button
                onClick={handleConfirmPriority}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer underline decoration-dotted underline-offset-4 italic"
                style={{
                  fontFamily: 'monospace',
                  imageRendering: 'pixelated',
                  textRendering: 'optimizeSpeed'
                }}
              >
                {getRandomSaveMessage()}
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PrioritySelector;
