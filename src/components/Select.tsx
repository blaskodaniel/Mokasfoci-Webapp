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
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`
              w-full px-3 py-2 
              bg-gray-700 border border-gray-600 
              text-white placeholder-gray-400
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
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
