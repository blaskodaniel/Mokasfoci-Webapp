interface PanelProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  footer?: string;
  wrapperClassName?: string;
  loading?: boolean;
  error?: string;
}

const Panel = ({
  children,
  className,
  title,
  footer,
  wrapperClassName,
  loading,
  error,
}: PanelProps) => {
  return (
    <div
      className={`relative bg-panel-bg border border-primary rounded-md overflow-hidden w-full ${wrapperClassName}`}
    >
      <div className="bg-surface pl-3 py-2 rounded-t-md font-medium text-sm border-b border-primary/50">
        {title}
      </div>
      {error && <div className="p-4 text-red-500">{error}</div>}
      <div
        className={`relative py-2 ${loading ? "min-h-40" : ""} ${className}`}
      >
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
      {footer && (
        <div className="bg-primary pl-2 py-1 rounded-b-md text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};
export default Panel;
