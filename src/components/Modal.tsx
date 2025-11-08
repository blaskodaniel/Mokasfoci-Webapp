import { IoCloseOutline } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black/80 bg-opacity-10 flex items-center justify-center z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className={`rounded-lg p-4 shadow-lg relative flex flex-col ${className}`}
      >
        {(onClose || title) && (
          <div
            className={`flex ${
              title ? "justify-between" : "justify-end"
            } items-center mb-4`}
          >
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {onClose && (
              <IoCloseOutline
                color="black"
                size={20}
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              />
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
