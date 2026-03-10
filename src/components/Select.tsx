/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller, type Control } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  control: Control<any>;
  options: Option[];
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  status?: "pending" | "success" | "failed" | "default";
}

const Select: React.FC<SelectProps> = ({
  name,
  control,
  options,
  placeholder = "Válassz...",
  className = "",
  error,
  label,
  required,
  disabled,
  description,
  status = "default",
}) => {
  let labelColorClass = "text-gray-300";
  if (status === "success") labelColorClass = "text-green-400 font-bold";
  else if (status === "failed") labelColorClass = "text-red-400 font-bold";

  let selectBgColorClass = disabled
    ? "bg-gray-800 border-gray-800 appearance-none"
    : "bg-gray-700 border border-gray-600";
  let selectTextColorClass = "text-white";

  if (!disabled) {
    if (status === "success") {
      selectBgColorClass = "bg-green-900/20 border-green-500 focus:ring-green-500";
      selectTextColorClass = "text-green-400 font-semibold";
    } else if (status === "failed") {
      selectBgColorClass = "bg-red-900/20 border-red-500 focus:ring-red-500";
      selectTextColorClass = "text-red-400 font-semibold";
    }
  }

  return (
    <div className="mb-2 md:mb-4">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${labelColorClass}`}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <Controller
        name={name}
        disabled={disabled}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`
              w-full px-3 py-2 pr-10
              ${selectBgColorClass} 
              ${selectTextColorClass} placeholder-gray-400
              rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              focus:border-transparent
              ${error ? "border-red-400 focus:ring-red-500" : ""}
              ${className}
            `}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {description && <p className="text-xs text-gray-400 mt-2 px-1">{description}</p>}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
