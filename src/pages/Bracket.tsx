import BracketComponent from "@/components/Bracket/BracketComponent";
import Loader from "@/components/Loader";
import { useTournamentBracket } from "@/hooks/api/useMatches";
import { MatchType } from "@/utils/enums";
import { useMemo } from "react";

const BracketPage = () => {
  const { data: bracketData, isLoading } = useTournamentBracket();

  // 1. Kiszedjük a bronzmeccset (ha már letöltöttek)
  const thirdPlaceMatch = bracketData?.thirdPlaceMatch || undefined;

  // 2. Csoportosítjuk a meccseket a típusuk alapján, memórizálva a jobb teljesítményért
  const rounds = useMemo(() => {
    const allMatches = bracketData?.matches || [];

    const getMatchesByType = (type: MatchType) => {
      return allMatches.filter((m) => m.type === type);
    };

    const allRounds = [
      {
        id: "round-32",
        title: "Legjobb 32",
        matches: getMatchesByType(MatchType.RoundOf32),
      },
      {
        id: "round-16",
        title: "Nyolcaddöntő",
        matches: getMatchesByType(MatchType.RoundOf16),
      },
      {
        id: "quarter-final",
        title: "Negyeddöntő",
        matches: getMatchesByType(MatchType.Quarterfinal),
      },
      {
        id: "semi-final",
        title: "Elődöntő",
        matches: getMatchesByType(MatchType.Semifinal),
      },
      {
        id: "final",
        title: "Döntő",
        matches: getMatchesByType(MatchType.Final),
      },
    ];

    return allRounds.filter((round) => round.matches.length > 0);
  }, [bracketData?.matches]);

  if (isLoading) {
    return <Loader text="Ágrajz betöltése..." />;
  }

  return (
    <BracketComponent
      rounds={rounds}
      thirdPlaceMatch={thirdPlaceMatch}
      positionVector={BracketPositionVector}
    />
  );
};

export default BracketPage;

const BracketPositionVector = [
  74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87, 89, 90, 93, 94, 91, 92, 95, 96,
  97, 98, 99, 100, 101, 102,
];
