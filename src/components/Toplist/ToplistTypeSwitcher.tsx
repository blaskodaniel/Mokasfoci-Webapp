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
    <div className="mb-4 flex flex-col gap-3 rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] p-3 shadow-tile sm:flex-row sm:items-center sm:justify-between">
      {!isMobile && <div className="max-w-2xl text-xs leading-5 text-text-muted">{description}</div>}

      {/* TABS */}
      <div className="w-full sm:max-w-md">
        <div className="flex w-full rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => {
              setToplistType(ToplistType.netscore);
            }}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all sm:text-sm ${
              toplistType === ToplistType.netscore
                ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_4px_14px_-4px_rgba(107,75,255,0.6)]"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Összpontszám szerint
          </button>
          <button
            type="button"
            onClick={() => {
              setToplistType(ToplistType.roi);
            }}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all sm:text-sm ${
              toplistType === ToplistType.roi
                ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_4px_14px_-4px_rgba(107,75,255,0.6)]"
                : "text-text-muted hover:text-text-primary"
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
              className="mt-2 flex items-center gap-1 px-2 text-xs text-text-muted transition-colors hover:text-text-primary"
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
                  <div className="px-2 pb-1 pt-2 text-xs leading-5 text-text-muted">{description}</div>
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
