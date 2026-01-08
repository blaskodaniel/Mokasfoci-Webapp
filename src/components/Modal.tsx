import { IoCloseOutline } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/80 bg-opacity-10 flex items-start justify-center 
        pt-0 sm:pt-20 z-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className={`shadow-lg relative flex flex-col w-full h-full sm:h-auto sm:rounded-lg ${className}`}
      >
        {title && (
          <div className={`flex ${title ? "justify-between" : "justify-end"} items-center mb-4`}>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
          </div>
        )}

        {onClose && (
          <IoCloseOutline
            color="white"
            size={20}
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 cursor-pointer"
          />
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
