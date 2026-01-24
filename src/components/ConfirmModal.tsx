import type { FC } from "react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:bottom-auto 
            sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 
            w-full sm:w-[455px] bg-quaternary px-6 py-6 rounded-t-2xl sm:rounded-xl shadow-2xl 
            border-t sm:border border-gray-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            {description && <p className="text-gray-300 mb-6">{description}</p>}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                text="Mégsem"
                onClick={onCancel}
                className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto px-6 py-2.5"
              />
              <Button
                text="Igen"
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto px-6 py-2.5"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
