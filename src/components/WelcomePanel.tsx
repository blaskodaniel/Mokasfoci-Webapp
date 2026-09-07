import { useConfig } from "@/hooks/useConfig";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { differenceInSeconds, parseISO } from "date-fns";
import { parse } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
      const days = Math.ceil(diff / (24 * 3600)) - 1;
      setTimeLeft(`${days} nap`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config?.championStartDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)]
        shadow-tile p-6 w-full mt-5 sm:mt-10 flex flex-col items-center"
    >
      <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <h2 className="relative text-2xl font-bold text-center text-text-primary mb-4">
        Üdvözlünk a Mokasfoci-n!
      </h2>
      {config?.championStartDate && (
        <>
          <div className="relative text-lg text-text-secondary mb-2 text-center">
            A bajnokság kezdéséig hátralévő idő
          </div>
          <div
            className="relative flex gap-2 items-center justify-center bg-[image:var(--gradient-cta)]
           text-white px-6 py-2 rounded-xl shadow-[0_10px_28px_-8px_rgba(107,75,255,0.65)]
           text-xl sm:text-3xl font-mono tracking-widest animate-pulse"
          >
            {timeLeft}
          </div>
        </>
      )}
      <div className="relative sm:w-[70%] mt-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-sm text-gray-300 font-light leading-relaxed">
        Ha még nem tetted, akkor állítsd be a{" "}
        <Link
          to="/profilom"
          className="font-medium text-accent-soft hover:text-highlight transition-colors underline underline-offset-2 decoration-accent-soft/50"
        >
          Profilom
        </Link>{" "}
        oldal alatt a csoportgyőztes tippjeidet és a bajnok csapat tipped, hogy ne maradj le a
        pluszpontokról!
      </div>
    </motion.div>
  );
};
export default WelcomePanel;
