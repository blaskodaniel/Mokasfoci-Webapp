import useResponsive from "@/hooks/useResponsive";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

const NET_SCORE_DESC =
  "Ez a lista a játékosok összesített nyereménye (nettó profit) szerint rangsorol. A pontszám azt mutatja, mennyi nyereményt halmozott fel a játékos a fogadásaival eddig. Minél magasabb az érték, annál többet nyert összességében. Csak a sikeres fogadások számítanak, a vesztesek nem csökkentik a pontszámot.";

const ROI_DESC =
  "Ez a lista a megtérülés (ROI) alapján rangsorol, vagyis a nyereményt a feltett tét arányában nézi. A magasabb százalék hatékonyabb, nyereségesebb fogadásokat jelent. Mind a sikeres fogadások, mind a vesztesek számítanak a pontszám kiszámításánál. A pontszám alatta a játékos összesített nyereményét minusz a feltett tétjét mutatja.";

enum ToplistType {
  netscore = "netscore",
  roi = "roi",
}

function ToplistTypeSwitcher({
  toplistType,
  setToplistType,
}: {
  toplistType: ToplistType;
  setToplistType: (type: ToplistType) => void;
}) {
  const { isMobile } = useResponsive();
  const [isDescOpen, setIsDescOpen] = useState(false);

  const description = toplistType === ToplistType.netscore ? NET_SCORE_DESC : ROI_DESC;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 py-3 px-3">
      {/* Leírás - desktopon bal oldalon, mindig látszik */}
      {!isMobile && <div className="flex-1 text-xs text-gray-400 italic">{description}</div>}

      {/* TABS */}
      <div className="w-full sm:max-w-md">
        <div className="flex w-full bg-tertiary rounded-lg p-1">
          <button
            onClick={() => {
              setToplistType(ToplistType.netscore);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
              toplistType === ToplistType.netscore
                ? "bg-primary text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Összpontszám szerint
          </button>
          <button
            onClick={() => {
              setToplistType(ToplistType.roi);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
              toplistType === ToplistType.roi
                ? "bg-primary text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Megtérülés szerint
          </button>
        </div>

        {/* Lenyíló leírás - csak mobilon */}
        {isMobile && (
          <>
            <button
              type="button"
              onClick={() => setIsDescOpen((prev) => !prev)}
              aria-expanded={isDescOpen}
              className="flex items-center gap-1 text-xs text-gray-400
                 hover:text-white transition-colors px-3 mt-2 underline underline-offset-2"
            >
              <IoInformationCircleOutline className="text-sm" />
              Információ a listáról
            </button>
            <AnimatePresence initial={false}>
              {isDescOpen && (
                <motion.div
                  key="desc"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="text-xs text-gray-400 mb-2 italic px-3 pt-1">{description}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

export default ToplistTypeSwitcher;
