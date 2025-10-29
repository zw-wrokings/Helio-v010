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
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('text-blue-500');

  const colorOptions = [
    { name: 'red', class: 'text-red-500' },
    { name: 'orange', class: 'text-orange-500' },
    { name: 'amber', class: 'text-amber-500' },
    { name: 'yellow', class: 'text-yellow-500' },
    { name: 'lime', class: 'text-lime-500' },
    { name: 'green', class: 'text-green-500' },
    { name: 'emerald', class: 'text-emerald-500' },
    { name: 'teal', class: 'text-teal-500' },
    { name: 'cyan', class: 'text-cyan-500' },
    { name: 'sky', class: 'text-sky-500' },
    { name: 'blue', class: 'text-blue-500' },
    { name: 'indigo', class: 'text-indigo-500' },
    { name: 'violet', class: 'text-violet-500' },
    { name: 'purple', class: 'text-purple-500' },
    { name: 'fuchsia', class: 'text-fuchsia-500' },
    { name: 'pink', class: 'text-pink-500' },
    { name: 'rose', class: 'text-rose-500' },
    { name: 'slate', class: 'text-slate-400' },
    { name: 'gray', class: 'text-gray-400' },
  ];

  const handleCreateLabel = () => {
    if (inputValue.trim() && inputValue.length <= 20) {
      const newLabel: LabelData = {
        name: inputValue.trim(),
        color: selectedColor
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
      setSelectedColor('text-blue-500');
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
    return label?.color || 'text-gray-400';
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
        className="w-[280px] p-0 bg-[#1b1b1b] border border-[#414141] rounded-[12px] overflow-hidden flex flex-col"
        align="start"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Input Field with Color Picker */}
          <div className="p-3 border-b border-[#414141]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="create a label"
                className="flex-1 bg-transparent text-white text-sm px-0 py-2 outline-none placeholder-gray-500 border-none"
                maxLength={20}
              />
              {inputValue.trim() && (
                <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                  <PopoverTrigger asChild>
                    <Tag
                      className={cn("h-5 w-5 cursor-pointer transition-all hover:scale-110", selectedColor)}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-4 bg-[#252525] border border-[#414141] rounded-lg"
                    align="start"
                    side="right"
                    sideOffset={10}
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <Tag
                          key={color.name}
                          className={cn("h-8 w-8 cursor-pointer hover:scale-125 transition-all", color.class)}
                          onClick={() => {
                            setSelectedColor(color.class);
                            setColorPickerOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {inputValue.trim() && (
              <div className="mt-2">
                <Button
                  onClick={handleCreateLabel}
                  size="sm"
                  className="w-full bg-[#252525] text-white hover:bg-[#2e2e2e] border border-[#414141] rounded-[10px] h-8 text-sm"
                >
                  Create & Add Label
                </Button>
              </div>
            )}
          </div>

          {/* Available Labels */}
          {availableLabels.length > 0 && (
            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              <div className="text-xs text-gray-500 mb-2">Available Labels</div>
              {availableLabels.map((label, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLabel(label.name)}
                    className={cn(
                      "w-full justify-start text-left border border-[#414141] rounded-[15px] h-9 text-xs transition-all duration-200",
                      selectedLabels.includes(label.name)
                        ? "bg-[#2e2e2e] text-white"
                        : "bg-[#252525] text-gray-300 hover:bg-[#2e2e2e] hover:text-white"
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

          {/* Empty State */}
          {availableLabels.length === 0 && (
            <div className="p-8 text-center">
              <Tag className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No labels yet</p>
              <p className="text-xs text-gray-600 mt-1">Create your first label above</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LabelSelector;
