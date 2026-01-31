import { useState } from "react";
import InfoTooltip from "@/components/InfoTooltip";
import ScoreByMatchChart from "@/components/Charts/ScoreByMatchChart";
import WinLostChart from "@/components/Charts/WinLostChart";
import MobileBackBar from "@/components/MobileBackBar";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Statistics = () => {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div>
      <MobileBackBar title="Statisztikák" />
      <section>
        <h2 className="text-xl font-bold px-4">Nyereményed alakulása az átlaghoz képest</h2>
        <div className="text-xs text-text-secondary px-4 pt-1">
          <div className="pb-1 block">
            Ezen a grafikonon láthatod, hogyan alakul a nyereményed a mérkőzések során az összes
            játékos átlagos teljesítményéhez képest.
            <div
              className="mt-2 text-primary-light hover:text-white cursor-pointer flex items-center gap-1 transition-colors"
              onClick={() => setShowFormula(!showFormula)}
            >
              <span>Ha kíváncsi vagy itt a képlet az átlag kiszámításához</span>
              {showFormula ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          {showFormula && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-center my-2 text-lg overflow-visible">
                <div className="flex flex-col items-center">
                  <div className="border-b border-text-secondary px-2 pb-0.5 whitespace-nowrap flex items-center gap-1">
                    <InfoTooltip text="Összes tiszta nyeremény">
                      <span
                        className="font-bold hover:text-white cursor-help border-b 
                      border-dotted border-gray-500"
                      >
                        N
                      </span>
                    </InfoTooltip>
                    -
                    <InfoTooltip text="Vesztesek összes téte">
                      <span
                        className="font-bold hover:text-white cursor-help border-b 
                      border-dotted border-gray-500"
                      >
                        V
                      </span>
                    </InfoTooltip>
                    +
                    <InfoTooltip text="Nem fogadók büntetése">
                      <span
                        className="font-bold hover:text-white cursor-help border-b 
                      border-dotted border-gray-500"
                      >
                        B
                      </span>
                    </InfoTooltip>
                  </div>
                  <div className="pt-0.5">
                    <InfoTooltip text="Játékosok száma">
                      <span
                        className="font-bold hover:text-white cursor-help border-b 
                      border-dotted border-gray-500"
                      >
                        J
                      </span>
                    </InfoTooltip>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <ScoreByMatchChart />
      </section>

      <section className="flex flex-col gap-4 mt-4">
        <h2 className="text-xl font-bold px-4">Találati arány</h2>
        <div className="text-xs text-text-secondary px-4 pt-1">
          <div className="pb-1 block">
            Ezen a grafikonon láthatod, hogyan alakul a találati arányod a mérkőzések során.
          </div>
        </div>
        <WinLostChart height={250} />
      </section>
    </div>
  );
};

export default Statistics;
