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
      className="bg-[image:var(--tile-bg-gradient)] text-white p-6 rounded-tile border border-tile-border shadow-tile
      max-w-lg w-full h-auto! mx-4 sm:mx-auto"
      position="center"
    >
      <div className="text-sm leading-relaxed text-text-secondary max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </div>
    </Modal>
  );
};

export default HelpModal;
