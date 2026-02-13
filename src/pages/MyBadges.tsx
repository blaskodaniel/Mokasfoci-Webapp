import { useState } from "react";
import { motion } from "framer-motion";
import { BADGE_CONFIG } from "@/config";
import { useMyBadges } from "@/hooks/api/useBadges";
import type { Badge } from "@/models/badge.type";
import { BadgeType } from "@/utils/enums";

const BadgeCard = ({
  type,
  userBadge,
  hasBadge,
}: {
  type: BadgeType;
  userBadge: Badge | undefined;
  hasBadge: boolean;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const config = BADGE_CONFIG[type];

  return (
    <div
      className="h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full text-center"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center px-4 rounded-lg border ${
            hasBadge
              ? "bg-surface border-border shadow-sm"
              : "bg-panel-bg border-dashed border-border opacity-50 grayscale"
          }`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="relative w-32 h-32 mb-2">
            <img
              src={`/badges/${config.filename}`}
              alt={config.label}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs font-medium text-center text-text-primary">{config.label}</span>
          {hasBadge && userBadge?.count && userBadge.count > 1 && (
            <span className="mt-1 text-xs px-2 py-0.5 bg-accent/20 text-accent-soft border border-accent/30 rounded-full font-bold">
              x{userBadge.count}
            </span>
          )}
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 rounded-lg border bg-surface border-border shadow-sm ${
            !hasBadge ? "opacity-50 grayscale" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-sm font-bold text-text-primary mb-2">{config.label}</h3>
          <p className="text-xs text-text-secondary">{config.description}</p>
        </div>
      </motion.div>
    </div>
  );
};

const MyBadges = () => {
  const { data: badgesData, isLoading } = useMyBadges();
  const userBadges = badgesData?.badges || [];

  const allBadgeTypes = Object.values(BadgeType);

  if (isLoading) {
    return <div className="p-4 text-center text-text-muted">Loading badges...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Jelvényeim</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {allBadgeTypes.map((type) => {
          const userBadge = userBadges.find((b) => b.type === type);
          const hasBadge = !!userBadge;

          return <BadgeCard key={type} type={type} userBadge={userBadge} hasBadge={hasBadge} />;
        })}
      </div>
    </div>
  );
};

export default MyBadges;
