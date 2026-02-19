import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  onAfterClose?: () => void;
  position?: "top" | "center";
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  onAfterClose,
  position = "top",
}) => {
  return (
    <AnimatePresence onExitComplete={onAfterClose}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/80 bg-opacity-10 flex justify-center z-50 
          ${position === "center" ? "items-center p-4" : "items-start pt-0 sm:pt-20"}`}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`shadow-lg relative flex flex-col w-full h-full sm:h-auto sm:rounded-lg ${className}`}
          >
            {title && (
              <div
                className={`flex ${title ? "justify-between" : "justify-end"} items-center mb-4`}
              >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
