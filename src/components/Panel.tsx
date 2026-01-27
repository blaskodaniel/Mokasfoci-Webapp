interface PanelProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  footer?: string;
  wrapperClassName?: string;
  loading?: boolean;
  error?: string;
  noBackground?: boolean;
}

const Panel = ({
  children,
  className,
  title,
  footer,
  wrapperClassName,
  loading,
  error,
  noBackground,
}: PanelProps) => {
  return (
    <div
      className={`relative ${noBackground ? "" : "bg-panel-bg border border-primary/20"} rounded-md overflow-hidden 
        w-full ${wrapperClassName}`}
    >
      <div className="pl-2 py-2 rounded-t-md font-light text-sm text-gray-300">{title}</div>
      {error && <div className="p-4 text-red-500">{error}</div>}
      <div className={`relative ${loading ? "min-h-40" : ""} ${className}`}>
        {loading && (
          <div
            className="absolute inset-0 flex items-center 
          justify-center bg-black/60 text-white text-center z-10"
          >
            Loading...
          </div>
        )}
        {children}
      </div>
      {footer && <div className="bg-primary pl-2 py-1 rounded-b-md text-xs">{footer}</div>}
    </div>
  );
};
export default Panel;
