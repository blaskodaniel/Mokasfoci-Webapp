import { ImSpinner9 } from "react-icons/im";

const Button = ({
  text,
  subText,
  onClick,
  className,
  disabled,
  loading,
  type = "button",
  icon,
}: {
  text: string;
  subText?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}) => {
  return (
    <button
      type={type}
      className={`font-semibold rounded 
       transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={() => onClick?.()}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex justify-center items-center gap-3 text-white">
          <ImSpinner9 className="animate-spin" />
          Mentés...
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
    </button>
  );
};

export default Button;
