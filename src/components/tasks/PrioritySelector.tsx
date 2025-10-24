import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Flag } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  selectedPriority: 'Low' | 'Medium' | 'High';
  onSelect: (priority: 'Low' | 'Medium' | 'High') => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ selectedPriority, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedPriority, setTempSelectedPriority] = useState<'Low' | 'Medium' | 'High'>(selectedPriority);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handlePrioritySelect = (priority: 'Low' | 'Medium' | 'High') => {
    setTempSelectedPriority(priority);
    setShowConfirmation(true);
  };

  const handleConfirmPriority = () => {
    onSelect(tempSelectedPriority);
    setShowConfirmation(false);
    setOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityBg = (priority: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white';

    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/20';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20';
      case 'Low':
        return 'bg-green-500/20 text-green-400 hover:bg-green-500/20';
      default:
        return 'bg-[#252525] text-gray-300';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-400 hover:text-white hover:border hover:border-[#252232] hover:bg-[#1e1e1f] hover:rounded-[8px] px-3 py-1 h-8 whitespace-nowrap transition-all duration-200 border border-transparent"
          )}
        >
          <Flag className="h-4 w-4 mr-2" />
          Priority
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[240px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="start"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Priority Options */}
          <div className="p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrioritySelect('High')}
              className={cn(
                "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs flex items-center gap-2 transition-all duration-200",
                getPriorityBg('High', tempSelectedPriority === 'High')
              )}
            >
              <Flag className="h-4 w-4 text-red-400" />
              High Priority
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrioritySelect('Medium')}
              className={cn(
                "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs flex items-center gap-2 transition-all duration-200",
                getPriorityBg('Medium', tempSelectedPriority === 'Medium')
              )}
            >
              <Flag className="h-4 w-4 text-yellow-400" />
              Medium Priority
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrioritySelect('Low')}
              className={cn(
                "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs flex items-center gap-2 transition-all duration-200",
                getPriorityBg('Low', tempSelectedPriority === 'Low')
              )}
            >
              <Flag className="h-4 w-4 text-green-400" />
              Low Priority
            </Button>
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
