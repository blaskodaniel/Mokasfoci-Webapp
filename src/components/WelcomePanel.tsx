import { useConfig } from "@/hooks/useConfig";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { differenceInSeconds, parseISO } from "date-fns";
import { parse } from "date-fns";
import { Link } from "react-router-dom";

const WelcomePanel: FC = () => {
  const { config } = useConfig();

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!config?.championStartDate) return;
    // Try ISO first, then fallback to custom format
    let target: Date;
    try {
      target = parseISO(config.championStartDate);
      if (isNaN(target.getTime())) {
        // Fallback to custom format: 'yyyy.MM.dd HH:mm'
        target = parse(config.championStartDate, "yyyy.MM.dd HH:mm", new Date());
      }
    } catch {
      target = parse(config.championStartDate, "yyyy.MM.dd HH:mm", new Date());
    }
    const updateCountdown = () => {
      if (isNaN(target.getTime())) {
        setTimeLeft("Hibás kezdési dátum!");
        return;
      }
      const now = new Date();
      const diff = differenceInSeconds(target, now);
      if (diff <= 0) {
        setTimeLeft("A bajnokság elkezdődött!");
        return;
      }
      const days = Math.ceil(diff / (24 * 3600));
      setTimeLeft(`${days} nap`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config?.championStartDate]);

  return (
    <div className="bg-panel-bg bg-opacity-80 rounded-lg p-6 w-full mt-5 sm:mt-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-4">
        Üdvözlünk a Mokasfoci-n!
      </h2>
      {config?.championStartDate && (
        <>
          <div className="text-lg text-text-secondary mb-2 text-center">
            A bajnokság kezdéséig hátralévő idő
          </div>
          <div
            className="flex gap-2 items-center justify-center bg-linear-to-r
           from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 
           rounded-xl shadow-lg text-xl sm:text-3xl font-mono tracking-widest animate-pulse"
          >
            {timeLeft}
          </div>
        </>
      )}
      <div className="sm:w-[70%] mt-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-sm text-gray-300 font-light leading-relaxed">
        Ha még nem tetted, akkor állítsd be a{" "}
        <Link
          to="/profilom"
          className="font-medium text-purple-400 hover:text-pink-400 transition-colors underline underline-offset-2 decoration-purple-400/50"
        >
          Profilom
        </Link>{" "}
        oldal alatt a csoportgyőztes tippjeidet és a bajnok csapat tipped, hogy ne maradj le a
        pluszpontokról!
      </div>
    </div>
  );
};
export default WelcomePanel;
