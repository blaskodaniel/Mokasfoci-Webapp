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
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/80 flex justify-center z-50
          ${position === "center" ? "items-center p-4" : "items-start pt-0 sm:pt-5"}`}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`shadow-lg relative flex flex-col w-full h-full sm:h-auto sm:max-h-[calc(100vh-2rem)] overflow-hidden sm:rounded-lg ${className}`}
          >
            {title && (
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="text-base font-bold text-white">{title}</h2>
              </div>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Bezárás"
                className="absolute top-3 right-3 z-10 rounded-full bg-black/40 p-1.5
                  text-white/70 transition-colors hover:bg-black/60 hover:text-white cursor-pointer"
              >
                <IoCloseOutline size={20} />
              </button>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
