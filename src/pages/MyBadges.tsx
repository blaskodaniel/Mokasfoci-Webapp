import { BADGE_CONFIG } from "@/config";
import { useMyBadges } from "@/hooks/api/useBadges";
import { BadgeType } from "@/utils/enums";
import InfoTooltip from "@/components/InfoTooltip";

const MyBadges = () => {
  const { data: badgesData, isLoading } = useMyBadges();
  const userBadges = badgesData?.badges || [];

  const allBadgeTypes = Object.values(BadgeType);

  if (isLoading) {
    return <div className="p-4 text-center text-text-muted">Loading badges...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Jelvényeim</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {allBadgeTypes.map((type) => {
          const config = BADGE_CONFIG[type];
          const userBadge = userBadges.find((b) => b.type === type);
          const hasBadge = !!userBadge;

          return (
            <div
              key={type}
              className={`relative flex flex-col items-center justify-center p-4 
                rounded-lg border transition-all duration-200 ${
                  hasBadge
                    ? "bg-surface border-border shadow-sm"
                    : "bg-panel-bg border-dashed border-border opacity-50 grayscale"
                }`}
            >
              <div className="absolute top-2 right-2">
                <InfoTooltip text={config.description} />
              </div>
              <div className="relative w-20 h-20 mb-2">
                <img
                  src={`/badges/${config.filename}`}
                  alt={config.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-center text-text-primary">
                {config.label}
              </span>
              {hasBadge && userBadge.count > 1 && (
                <span className="mt-1 text-xs px-2 py-0.5 bg-accent/20 text-accent-soft border border-accent/30 rounded-full font-bold">
                  x{userBadge.count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBadges;
