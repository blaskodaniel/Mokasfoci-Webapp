import type { Column } from "@/components/Table/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import { formatNumber, getMatchStatusInfo, getMatchTypeText, outcomeText } from "@/utils/common";
import { CouponType, MatchOutcome, MatchStatus } from "@/utils/enums";
import { useEffect, useState, useMemo } from "react";
import { isBettableMatch, useAllMatches } from "@/hooks/api/useMatches";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { IoFootball } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "@/components/Calendar";
import useResponsive from "@/hooks/useResponsive";
import MatchesDesktopView from "@/components/Matches/DesktopView.tsx";
import MatchesMobileView from "@/components/Matches/MobileView";
import type { MatchWithUserBet } from "@/components/Matches/types";
import BetModal from "@/components/BetModal";
import { useAuth } from "@/hooks/useAuth";
import { useConfig } from "@/hooks/useConfig";
import OddsCell from "@/components/Matches/OddsCell";
import Button from "@/components/Button";
import { APP_CONFIG } from "@/config";

const MatchesPage = () => {
  const { isDesktop } = useResponsive();
  const { user: currentUser } = useAuth();
  const { config } = useConfig();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const championMinDate = useMemo(
    () => (config?.championStartDate ? new Date(config.championStartDate) : undefined),
    [config?.championStartDate]
  );
  const championMaxDate = useMemo(
    () => (config?.championEndDate ? new Date(config.championEndDate) : undefined),
    [config?.championEndDate]
  );
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Ha a mai nap szerepel a naptárban (a bajnokság range-en belül), selectáljuk alapértelmezetten
  useEffect(() => {
    if (!championMinDate && !championMaxDate) return; // config még nem töltött be
    const now = new Date();
    const afterMin = !championMinDate || now >= championMinDate;
    const beforeMax = !championMaxDate || now <= championMaxDate;
    if (afterMin && beforeMax) {
      setSelectedDate((prev) => prev ?? now);
    }
  }, [championMinDate, championMaxDate]);

  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useAllMatches({
    sortBy: "date",
    sortOrder: "asc",
    startDate: selectedDate,
    endDate: selectedDate,
  });

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  // Matches és myBets összevonása
  const matchesWithBets = useMemo((): MatchWithUserBet[] => {
    if (!matches || !myBets) return matches || [];

    const combined = matches.map((match) => {
      // Megkeressük a user fogadásokat ehhez a match-hez
      const userBet = myBets.filter((bet) => bet.matchid._id === match._id);

      return {
        ...match,
        userbet: userBet,
      };
    });

    // Rendezés státusz szerint: playing -> enabled -> többi
    return combined.sort((a, b) => {
      if (a.status === MatchStatus.playing && b.status !== MatchStatus.playing) {
        return -1;
      }
      if (a.status !== MatchStatus.playing && b.status === MatchStatus.playing) {
        return 1;
      }
      if (a.status === MatchStatus.enabled && b.status !== MatchStatus.enabled) {
        return -1;
      }
      if (a.status !== MatchStatus.enabled && b.status === MatchStatus.enabled) {
        return 1;
      }
      return 0;
    });
  }, [matches, myBets]);

  // Szinkronizáljuk a selectedMatch-et a frissült adatokkal amikor változnak az odds-ok
  useEffect(() => {
    if (selectedMatch && isBetModalOpen) {
      const updatedMatch = matchesWithBets.find((m) => m._id === selectedMatch._id);
      if (updatedMatch) {
        setSelectedMatch(updatedMatch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchesWithBets, isBetModalOpen, selectedMatch?._id]);

  useEffect(() => {
    refetchMatches();
    refetchMyBets();
  }, [refetchMatches, refetchMyBets]);

  const columns: Column<MatchWithUserBet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (match) => {
        const matchName = `${match.teamA?.name || match.teamAPlaceholder || ""} - ${match.teamB?.name || match.teamBPlaceholder || ""}`;
        const canViewDetails = match.status !== MatchStatus.enabled;

        return (
          <div className="flex min-w-0 flex-col gap-0.5 py-1">
            {canViewDetails ? (
              <Link
                to={`/merkozesek/${match._id}`}
                className="truncate font-semibold text-accent-soft transition-colors hover:text-highlight hover:underline"
              >
                {matchName}
              </Link>
            ) : (
              <span className="truncate font-semibold text-white">{matchName}</span>
            )}
            <span className="text-[10px] uppercase tracking-wide text-text-muted">
              {getMatchTypeText(match.type)}
            </span>
          </div>
        );
      },
      sortable: false,
      width: "2.5fr",
    },
    {
      header: "Eredmény",
      key: "result",
      render: (match) => (
        <div className="flex items-center justify-center">
          {match.status === MatchStatus.finished ? (
            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-sm font-black tracking-widest text-white">
              {match.goalA} - {match.goalB}
            </span>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </div>
      ),
      sortable: false,
      width: "1fr",
      className: "justify-center",
    },
    {
      header: "Státusz",
      key: "status",
      render: (match) => {
        const info = getMatchStatusInfo(match.status);
        if (!info.text) return <span className="text-text-muted">-</span>;
        return (
          <span
            className={`${info.color} ${info.className} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide`}
          >
            {info.text}
          </span>
        );
      },
      sortable: true,
      width: "1fr",
    },

    {
      header: "Hazai",
      key: "oddsAwin",
      render: (match) => <OddsCell match={match} outcome={MatchOutcome.home} />,
      sortable: true,
      width: "1fr",
    },
    {
      header: "Döntetlen",
      key: "oddsDraw",
      render: (match) => <OddsCell match={match} outcome={MatchOutcome.draw} />,
      sortable: true,
      width: "1fr",
    },
    {
      header: "Vendég",
      key: "oddsBwin",
      render: (match) => <OddsCell match={match} outcome={MatchOutcome.away} />,
      sortable: true,
      width: "1fr",
    },
    {
      header: "Saját fogadás",
      key: "userbet",
      render: (match) => {
        if (!match.userbet || match.userbet.length === 0) {
          return <span className="text-text-muted text-xs">-</span>;
        }

        const bets = match.userbet;

        return (
          <div className="flex flex-col gap-2 py-1">
            {bets.map((betItem) => {
              const isOutcome = betItem.type === CouponType.outcomeBet;
              const team =
                isOutcome && betItem.outcome === MatchOutcome.home
                  ? match.teamA
                  : isOutcome && betItem.outcome === MatchOutcome.away
                    ? match.teamB
                    : undefined;
              const label = isOutcome
                ? outcomeText(betItem, match)
                : `${betItem.scoreTeamA} - ${betItem.scoreTeamB}`;

              return (
                <div key={betItem._id} className="flex items-center gap-2">
                  {team?.flag && (
                    <img
                      src={`${APP_CONFIG.FLAG_PATH}${team.flag}`}
                      alt={team.name}
                      className="h-5 w-5 shrink-0 rounded-full border border-white/10 object-cover"
                    />
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold text-white">{label}</span>
                    <span className="text-[10px] font-semibold text-badge-amber">
                      Tét: {formatNumber(betItem.amount)} pont
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
      sortable: false,
      width: "2fr",
    },
    {
      header: "Dátum",
      key: "date",
      render: (match) => (
        <span className="text-text-secondary text-xs">
          {match.date && format(new Date(match.date), "MMM dd HH:mm")}
        </span>
      ),
      sortable: true,
      width: "1fr",
    },
    {
      header: "",
      key: "actions",
      render: (match) => {
        const hasUserBet = Array.isArray(match.userbet) && match.userbet.length > 0;
        const isMatchEnabled = match.status === MatchStatus.enabled;
        const hasEnoughScore = currentUser && currentUser.data.availableScore > 99;

        if (!match?.teamA || !match?.teamB || !match?.date) {
          return null;
        }

        // Ha van fogadás és a mérkőzés aktív
        if (hasUserBet && isMatchEnabled) {
          return (
            <Button
              variant="secondary"
              size="sm"
              text="Módosítás"
              className="w-full"
              onClick={() => {
                setSelectedMatch(match);
                setIsBetModalOpen(true);
              }}
            />
          );
        }

        // Ha nincs fogadás, van elég pont és a mérkőzés aktív
        if (!hasUserBet && hasEnoughScore && isBettableMatch(match)) {
          return (
            <Button
              variant="cta"
              size="sm"
              text="Fogadás"
              className="w-full"
              onClick={() => {
                setSelectedMatch(match);
                setIsBetModalOpen(true);
              }}
            />
          );
        }

        // Minden más esetben üres
        return null;
      },
      width: "w-32",
      className: "justify-center",
    },
  ];
  const isCollapsed = !isDesktop && scrolled;

  return (
    <div>
      <div
        className={
          !isDesktop
            ? "sticky top-12 z-30 -mx-1 bg-secondary/95 px-1 pt-2 backdrop-blur-sm"
            : ""
        }
      >
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.h1
              key="title"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center gap-2 overflow-hidden text-xl font-bold text-white pb-2 sm:justify-start sm:text-2xl"
            >
              <IoFootball className="text-accent-soft" />
              Mérkőzések
            </motion.h1>
          )}
        </AnimatePresence>
        <Calendar
          onDateSelect={(date) => setSelectedDate(date)}
          selectedDate={selectedDate}
          minDate={championMinDate}
          maxDate={championMaxDate}
        />
      </div>
      {isDesktop && (
        <section>
          <MatchesDesktopView
            matchesWithBets={matchesWithBets}
            columns={columns}
            error={
              (matchesError?.message || myBetsError?.message) &&
              "Valami hiba történt, kérlek próbáld újra később."
            }
            loading={matchesLoading || myBetsLoading}
            emptyMessage={
              !selectedDate
                ? "Válassz egy napot a naptárból a mérkőzések megjelenítéséhez"
                : "Még nincsenek mérkőzések erre a napra"
            }
          />
        </section>
      )}

      {!isDesktop && (
        <section>
          <MatchesMobileView
            matchesWithBets={matchesWithBets}
            error={
              (matchesError?.message || myBetsError?.message) &&
              "Valami hiba történt, kérlek próbáld újra később."
            }
            loading={matchesLoading || myBetsLoading}
            emptyMessage={
              !selectedDate
                ? "Válassz egy napot a naptárból a mérkőzések megjelenítéséhez"
                : "Még nincsenek mérkőzések erre a napra"
            }
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              setIsBetModalOpen(true);
            }}
          />
        </section>
      )}

      {selectedMatch && (
        <BetModal
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => setSelectedMatch(null)}
          bets={myBets || []}
        />
      )}
    </div>
  );
};

export default MatchesPage;
