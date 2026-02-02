import { useClickOutside } from "@/hooks/useClickOutside";
import React, { useState, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Válassz...",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bezárás kattintásra a komponensen kívül
  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="w-full relative group" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full min-h-[32px] px-3 py-2 text-left bg-surface/50 backdrop-blur-sm 
          border text-sm rounded-lg transition-all duration-200 outline-none
          flex items-center justify-between
          ${isOpen ? "border-accent ring-1 ring-accent/30" : "border-white/10 hover:border-white/20"}
        `}
      >
        <div className="flex flex-wrap gap-1.5 pr-6">
          {selectedValues.length === 0 ? (
            <span className="text-text-secondary/50">{placeholder}</span>
          ) : (
            selectedValues.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs 
                  font-medium bg-accent/20 text-white/80 border border-accent/20"
                >
                  {option?.label}
                  <span
                    role="button"
                    className="ml-1.5 hover:text-white focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(value);
                    }}
                  >
                    ×
                  </span>
                </span>
              );
            })
          )}
        </div>

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-[#1a1f2e] border border-white/10 
        rounded-lg shadow-xl max-h-60 overflow-y-auto backdrop-blur-xl animate-in 
        fade-in zoom-in-95 duration-100"
        >
          <div className="p-1 space-y-0.5">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-text-secondary text-center">
                Nincs elérhető adat
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      relative flex items-center px-3 py-2 text-sm rounded-md 
                      cursor-pointer select-none transition-colors
                      ${
                        isSelected
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-text-primary hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                      flex items-center justify-center w-4 h-4 mr-3 rounded border transition-colors
                      ${
                        isSelected
                          ? "bg-accent border-accent text-black"
                          : "border-white/20 bg-transparent"
                      }
                    `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
