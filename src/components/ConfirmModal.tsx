import type { FC } from "react";
import Modal from "./Modal";
import Button from "./Button";

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
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      className="sm:w-[455px] bg-quaternary px-4 py-3 sm:mx-3"
    >
      <div className="">
        <p>{description}</p>
        <div className="flex flex-1 gap-2 mt-4 sm:mt-2 flex-col sm:flex-row justify-end">
          <Button
            text="Mégsem"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 w-full py-3 sm:py-2"
          />
          <Button
            text="Igen"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 w-full py-3 sm:py-2"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
