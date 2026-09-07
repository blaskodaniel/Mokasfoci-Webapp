import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <div
      className="relative flex min-h-screen flex-col items-start justify-start overflow-hidden
        px-5 pt-10 pb-10 sm:items-center sm:justify-center sm:px-4 sm:py-10"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-highlight/15 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md sm:overflow-hidden sm:rounded-tile sm:border
          sm:border-tile-border sm:bg-[image:var(--tile-bg-gradient)] sm:shadow-tile sm:p-8"
      >
        <h1 className="text-left text-2xl font-bold text-text-primary sm:text-center">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-left text-sm text-text-secondary leading-relaxed sm:text-center">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
