import { cva, type VariantProps } from "class-variance-authority";
import { ImSpinner9 } from "react-icons/im";
import { motion } from "framer-motion";

const buttonVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      cta: "bg-[image:var(--gradient-cta)] text-white shadow-[0_10px_24px_-10px_rgba(107,75,255,0.7)] hover:bg-[image:var(--gradient-cta-hover)]",
      primary: "bg-button-bg text-white hover:bg-button-bg-hover",
      secondary: "bg-button-secondary-bg text-white hover:bg-button-secondary-bg-hover",
      ghost: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
      danger: "bg-red-600 text-white hover:bg-red-700",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    },
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  text: string;
  subText?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

const Button = ({
  text,
  subText,
  onClick,
  className,
  disabled,
  loading,
  loadingText,
  type = "button",
  icon,
  variant,
  size,
}: ButtonProps) => {
  const variantClasses = variant ? buttonVariants({ variant, size: size ?? "md" }) : "";

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { y: -1 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={`font-semibold rounded ${variant ? "rounded-lg" : ""}
       transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${className || ""}`}
      onClick={() => onClick?.()}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex justify-center items-center gap-3 text-white">
          <ImSpinner9 className="animate-spin" />
          {loadingText || "Mentés..."}
        </div>
      ) : (
        <div className="flex flex-col items-center text-white">
          <div className="flex items-center gap-1">
            {icon && <span className="pr-2">{icon}</span>}
            <span className="text-md font-semibold">{text}</span>
          </div>
          {subText && <span className="text-xs font-normal">{subText}</span>}
        </div>
      )}
    </motion.button>
  );
};

export default Button;
