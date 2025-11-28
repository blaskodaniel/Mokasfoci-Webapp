import { ImSpinner9 } from "react-icons/im";

const Button = ({
  text,
  onClick,
  className,
  disabled,
  loading,
}: {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <button
      type="submit"
      className={`font-semibold rounded 
       transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex justify-center items-center gap-3 text-white">
          <ImSpinner9 className="animate-spin" />
          Mentés...
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default Button;
