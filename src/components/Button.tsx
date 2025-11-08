const Button = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      type="submit"
      className={`w-full md:w-auto bg-purple-600 disabled:bg-purple-400
       text-white font-semibold py-1 px-4 rounded hover:bg-purple-700 transition cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
