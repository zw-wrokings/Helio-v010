import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tag, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LabelSelectorProps {
  selectedLabels: string[];
  onSelect: (labels: string[]) => void;
}

interface LabelData {
  name: string;
  color: string;
}

const LabelSelector: React.FC<LabelSelectorProps> = ({ selectedLabels, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [availableLabels, setAvailableLabels] = useState<LabelData[]>(() => {
    const saved = localStorage.getItem('kario-labels');
    return saved ? JSON.parse(saved) : [];
  });

  const presetLabels: LabelData[] = [
    { name: '#ByKairo', color: 'text-blue-500' },
    { name: '#School', color: 'text-green-500' },
    { name: '#Work', color: 'text-orange-500' },
    { name: '#Personal', color: 'text-pink-500' },
    { name: '#Urgent', color: 'text-red-500' },
    { name: '#Shopping', color: 'text-cyan-500' },
    { name: '#Health', color: 'text-emerald-500' },
    { name: '#Finance', color: 'text-amber-500' },
    { name: '#Family', color: 'text-rose-500' },
    { name: '#Projects', color: 'text-teal-500' },
  ];

  const handleCreateLabel = () => {
    if (inputValue.trim() && inputValue.length <= 20) {
      const newLabel: LabelData = {
        name: inputValue.trim(),
        color: 'text-blue-500'
      };

      const labelExists = availableLabels.find(l => l.name.toLowerCase() === newLabel.name.toLowerCase());

      if (!labelExists) {
        const updatedLabels = [...availableLabels, newLabel];
        setAvailableLabels(updatedLabels);
        localStorage.setItem('kario-labels', JSON.stringify(updatedLabels));
      }

      if (!selectedLabels.includes(newLabel.name)) {
        onSelect([...selectedLabels, newLabel.name]);
      }

      setInputValue('');
    }
  };

  const handleToggleLabel = (labelName: string) => {
    if (selectedLabels.includes(labelName)) {
      onSelect(selectedLabels.filter(l => l !== labelName));
    } else {
      onSelect([...selectedLabels, labelName]);
    }
  };

  const handleDeleteLabel = (labelName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLabels = availableLabels.filter(l => l.name !== labelName);
    setAvailableLabels(updatedLabels);
    localStorage.setItem('kario-labels', JSON.stringify(updatedLabels));

    if (selectedLabels.includes(labelName)) {
      onSelect(selectedLabels.filter(l => l !== labelName));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setInputValue(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateLabel();
    }
  };

  const getLabelColor = (labelName: string): string => {
    const label = availableLabels.find(l => l.name === labelName);
    if (label) return label.color;

    const preset = presetLabels.find(l => l.name === labelName);
    return preset?.color || 'text-gray-400';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-400 hover:text-white hover:border hover:border-[#252232] hover:bg-[#1e1e1f] hover:rounded-[8px] px-3 py-1 h-8 whitespace-nowrap transition-all duration-200 border border-transparent",
            selectedLabels.length > 0 && "text-white border-[#252232] bg-[#1e1e1f] rounded-[8px]"
          )}
        >
          <Tag className="h-4 w-4 mr-2" />
          {selectedLabels.length > 0 ? `${selectedLabels.length} Label${selectedLabels.length > 1 ? 's' : ''}` : 'Label'}
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
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="create a label"
              className="w-full bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
              maxLength={20}
            />
          </div>

          {inputValue.trim() && (
            <div className="px-3 pb-3">
              <Button
                onClick={handleCreateLabel}
                size="sm"
                className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-9 text-sm"
              >
                Create: {inputValue}
              </Button>
            </div>
          )}

          {availableLabels.length > 0 && (
            <div className="px-3 pb-3 space-y-2">
              <div className="text-xs text-gray-500 mb-2">Custom Labels</div>
              {availableLabels.map((label, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLabel(label.name)}
                    className={cn(
                      "w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200",
                      selectedLabels.includes(label.name) && "bg-[#2e2e2e] text-white"
                    )}
                  >
                    <Tag className={cn("h-4 w-4 mr-2", label.color)} />
                    {label.name}
                    {selectedLabels.includes(label.name) && (
                      <span className="ml-auto text-green-400">✓</span>
                    )}
                  </Button>
                  <button
                    onClick={(e) => handleDeleteLabel(label.name, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-md"
                  >
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 space-y-2">
            {availableLabels.length > 0 && (
              <div className="text-xs text-gray-500 mb-2">Preset Labels</div>
            )}
            {presetLabels.map((preset, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleToggleLabel(preset.name)}
                className={cn(
                  "w-full justify-start text-left bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200",
                  selectedLabels.includes(preset.name) && "bg-[#2e2e2e] text-white"
                )}
              >
                <Tag className={cn("h-4 w-4 mr-2", preset.color)} />
                {preset.name}
                {selectedLabels.includes(preset.name) && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LabelSelector;
