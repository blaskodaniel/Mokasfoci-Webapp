import type { FC, ReactNode } from "react";
import Modal from "./Modal";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="bg-secondary text-white p-6 rounded-xl border border-white/10 shadow-2xl 
      max-w-lg w-full h-auto! mx-4 sm:mx-auto"
      position="center"
    >
      <div className="text-sm leading-relaxed text-gray-300 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </div>
    </Modal>
  );
};

export default HelpModal;
