/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller, type Control } from "react-hook-form";

interface InputProps {
  name: string;
  control: Control<any>;
  type?: "text" | "file" | "email" | "password";
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  accept?: string; // file input esetén
}

const Input: React.FC<InputProps> = ({
  name,
  control,
  type = "text",
  placeholder,
  className = "",
  error,
  label,
  required,
  accept,
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
        render={({ field: { onChange, value, ...field } }) => (
          <input
            {...field}
            type={type}
            value={type === "file" ? undefined : value}
            onChange={
              type === "file" ? (e) => onChange(e.target.files?.[0]) : onChange
            }
            placeholder={placeholder}
            accept={accept}
            className={`
              w-full px-3 py-2 
              bg-gray-700 border border-gray-600 
              text-white placeholder-gray-400
              rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              focus:border-transparent
              ${error ? "border-red-400 focus:ring-red-500" : ""}
              ${
                type === "file"
                  ? "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  : ""
              }
              ${className}
            `}
          />
        )}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
