interface PanelProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  footer?: string;
}

const Panel = ({ children, className, title, footer }: PanelProps) => {
  return (
    <div
      className={`bg-panel-bg border border-primary rounded-md overflow-hidden w-full`}
    >
      <div className="bg-surface pl-3 py-2 rounded-t-md font-medium text-sm border-b border-primary/50">
        {title}
      </div>
      <div className={`py-2 ${className}`}>{children}</div>
      {footer && (
        <div className="bg-primary pl-2 py-1 rounded-b-md text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};
export default Panel;
