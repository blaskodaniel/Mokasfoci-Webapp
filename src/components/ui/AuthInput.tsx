import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightElement?: ReactNode;
}

const AuthInput = ({ label, id, rightElement, className = "", ...props }: AuthInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-lg border border-tile-border bg-white/5 px-3.5 py-2.5 text-sm
            text-white placeholder:text-text-muted transition-colors focus:border-accent/60
            focus:outline-none focus:ring-2 focus:ring-accent/30 ${rightElement ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
