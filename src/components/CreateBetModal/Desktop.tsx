import { useState, type FC } from "react";
import Button from "../Button";
import Modal from "../Modal";
import WheelPicker from "../WheelPicker";
import type { Match } from "@/models/match.type";
import { APP_CONFIG } from "@/config";

interface CreateBetModalDesktopProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedMatch: Match;
}

const CreateBetModalDesktop: FC<CreateBetModalDesktopProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedMatch,
}) => {
  const [betValue, setBetValue] = useState<number>(1000);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  if (!selectedMatch) return null;

  const onSubmit = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Fogadás létrehozása"
      className="sm:w-[455px] bg-quaternary px-4 py-3 sm:mx-3"
    >
      <div className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            {selectedMatch.teamA?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${selectedMatch.teamA.flag}`}
                alt={`${selectedMatch.teamA.name} flag`}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <span className="text-lg">{selectedMatch.teamA?.name}</span>
          </div>
          <div>vs.</div>
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            {selectedMatch.teamB?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${selectedMatch.teamB.flag}`}
                alt={`${selectedMatch.teamB.name} flag`}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <span className="text-lg">{selectedMatch.teamB?.name}</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-8">
          <div
            onClick={() => setSelectedTeamId(selectedMatch.teamA?._id || "")}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium w-min-20 
              cursor-pointer transition-colors duration-300 ${
                selectedTeamId === selectedMatch.teamA?._id
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            {selectedMatch.teamA?.name}
          </div>
          <div
            onClick={() => setSelectedTeamId("draw")}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium w-min-20 
              cursor-pointer transition-colors duration-300 ${
                selectedTeamId === "draw"
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            döntetlen
          </div>
          <div
            onClick={() => setSelectedTeamId(selectedMatch.teamB?._id || "")}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium w-min-20 
              cursor-pointer transition-colors duration-300 ${
                selectedTeamId === selectedMatch.teamB?._id
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            {selectedMatch.teamB?.name}
          </div>
        </div>

        <div className="mt-6 flex-1 sm:flex-none">
          <label className="block text-sm font-medium mb-3 text-center">
            Feltett tét
          </label>
          <div className="flex justify-center">
            <WheelPicker
              values={Array.from({ length: 20 }, (_, i) => (i + 1) * 100)}
              selectedValue={betValue}
              onValueChange={(value) => setBetValue(value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Mobile: Sticky button at bottom, Desktop: Regular button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-quaternary sm:relative sm:p-0 sm:bg-transparent sm:mt-6">
          <Button
            text={`Fogadás ${betValue > 0 ? `- ${betValue} pont` : ""}`}
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700 w-full py-3 sm:py-2"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateBetModalDesktop;
