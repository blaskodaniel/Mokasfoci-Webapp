/* eslint-disable @typescript-eslint/no-explicit-any */
import { useScoreByMatches } from "@/hooks/api/usePlayers";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import Loader from "../Loader";
import { formatNumber } from "@/utils/common";
import { IoStatsChart } from "react-icons/io5";

const COLORS = [
  "#e6194B", // Red
  "#3cb44b", // Green
  "#ffe119", // Yellow
  "#4363d8", // Blue
  "#f58231", // Orange
  "#911eb4", // Purple
  "#42d4f4", // Cyan
  "#f032e6", // Magenta
  "#bfef45", // Lime
  "#fabed4", // Pink
  "#469990", // Teal
  "#dcbeff", // Lavender
  "#9A6324", // Brown
  "#800000", // Maroon
  "#aaffc3", // Mint
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: any;
    color: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-3 
      shadow-lg z-30"
      >
        <p className="text-text-secondary text-sm mb-2 font-medium">
          {data.isInitial ? "Kezdeti állapot" : `${data.teamA} - ${data.teamB}`}
        </p>
        <div className="space-y-1">
          {data.change >= 0 && <p className="text-green-400">+{data.change}</p>}
          {data.isNotBetting && <p className="text-red-400">Nem fogadtál</p>}
          {!data.isNotBetting && data.change < 0 && <p className="text-red-400">Vesztett</p>}
          <div className="border-t border-gray-600 my-2" />
          <p className="text-sm text-text-secondary">
            <span className="text-text-secondary">Pontod:</span>{" "}
            <span className="font-semibold text-blue-400">{formatNumber(data.balance)}</span>
          </p>
          <p className="text-sm text-text-secondary">
            <span className="text-text-secondary">Átlag:</span>{" "}
            <span className="font-semibold text-blue-400">
              {formatNumber(data.averageProfitBalance)}
            </span>
          </p>
          {payload.map((entry) => {
            if (entry.dataKey !== "balance" && entry.dataKey !== "averageProfitBalance") {
              return (
                <p key={entry.dataKey} className="text-sm text-text-secondary">
                  <span className="text-text-secondary">{entry.name}:</span>{" "}
                  <span className="font-semibold" style={{ color: entry.color }}>
                    {formatNumber(entry.value)}
                  </span>
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
  return null;
};

const ScoreByMatchChart = ({ userList = [] }: { userList?: string[] }) => {
  const { data: scoreByMatches, isLoading, error } = useScoreByMatches(userList);

  const otherUsersData = scoreByMatches?.users || [];

  // Highlight state: null = nincs kiemelve, string = a kiemelt vonal dataKey-je
  const [highlightedLine, setHighlightedLine] = useState<string | null>(null);

  const handleLegendClick = (dataKey: string) => {
    setHighlightedLine((prev) => (prev === dataKey ? null : dataKey));
  };

  // Segédfüggvény az opacity meghatározásához
  const getLineOpacity = (dataKey: string) => {
    if (!highlightedLine) return 1;
    return highlightedLine === dataKey ? 1 : 0.15;
  };

  // Adatok formázása a charthoz - rövidebb címkék a mérkőzésekhez
  const chartData = useMemo(() => {
    if (!scoreByMatches) return [];

    // Duplikációk szűrése matchId vagy isInitial alapján
    const uniqueMatches: any[] = [];
    const seenIds = new Set();

    for (const match of scoreByMatches.timeline) {
      const id = match.matchId || match.matchDate;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        uniqueMatches.push(match);
      }
    }

    const otherUsers = scoreByMatches.users || [];
    const otherUsersMap = new Map();

    otherUsers.forEach((u) => {
      u.data.forEach((d) => {
        const id = d.matchId || d.matchDate;
        if (!otherUsersMap.has(id)) {
          otherUsersMap.set(id, {});
        }
        otherUsersMap.get(id)[`user_${u.userid}`] = d.balance;
      });
    });

    return uniqueMatches.map((match) => {
      const id = match.matchId || match.matchDate;
      const extraData = otherUsersMap.get(id) || {};
      return {
        ...match,
        ...extraData,
        displayName: `${match.teamA} - ${match.teamB}`,
      };
    });
  }, [scoreByMatches]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Betöltés..." />
      </div>
    );
  }

  if (error || !chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-text-secondary">
        <IoStatsChart size={48} className="opacity-20" />
        <span className="text-sm">Még nincs megjeleníthető adat</span>
      </div>
    );
  }

  /* const scores = chartData.map((d: any) => d.profitBalance);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores); */

  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 15, right: 20, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="profitScoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9ff34ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#c9ff34ff" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="avarageProfitScoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#626981ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#626981ff" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#60fafaff" vertical={false} />
          <XAxis
            dataKey="displayName"
            hide
            stroke="#b6b1d4"
            tick={{ fill: "#b6b1d4", fontSize: 12 }}
            tickLine={{ stroke: "#60fafaff" }}
            label={{ value: "Mérkőzések", position: "insideBottom", offset: -5, fill: "#b6b1d4" }}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            stroke="#b6b1d4"
            tick={{ fill: "#b6b1d4", fontSize: 12 }}
            tickLine={{ stroke: "#2a2543" }}
            tickFormatter={(value) => {
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
            // label={{ value: "Pontok", angle: -90, position: "insideLeft", fill: "#b6b1d4" }}
          />
          <Tooltip content={<CustomTooltip />} />
          {/*  <ReferenceLine
          y={maxScore}
          label={{ position: "top", value: `Max: ${maxScore}`, fill: "#60fafaff", fontSize: 12 }}
          stroke="#60fafaff"
          strokeDasharray="3 3"
          opacity={0.5}
        />
        <ReferenceLine
          y={minScore}
          label={{ position: "bottom", value: `Min: ${minScore}`, fill: "#60fafaff", fontSize: 12 }}
          stroke="#60fafaff"
          strokeDasharray="3 3"
          opacity={0.5}
        /> */}
          <ReferenceLine
            y={0}
            label={{ position: "left", value: `0`, fill: "#60fafaff", fontSize: 12 }}
            stroke="#e08383ff"
            strokeDasharray="3 5"
            opacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#profitScoreGradient)"
            strokeWidth={highlightedLine === "balance" ? 4 : 3}
            dot={{ fill: "#60fafaff", r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={getLineOpacity("balance")}
          />
          <Line
            type="monotone"
            dataKey="averageProfitBalance"
            stroke="url(#avarageProfitScoreGradient)"
            strokeWidth={highlightedLine === "averageProfitBalance" ? 4 : 3}
            dot={{ fill: "#60fafaff", r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={getLineOpacity("averageProfitBalance")}
          />
          {otherUsersData.map((user, index) => {
            const dataKey = `user_${user.userid}`;
            return (
              <Line
                key={user.userid}
                type="monotone"
                dataKey={dataKey}
                name={user.username}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={highlightedLine === dataKey ? 3 : 2}
                dot={{ fill: COLORS[index % COLORS.length], r: 3 }}
                activeDot={{ r: 5 }}
                strokeOpacity={getLineOpacity(dataKey)}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-4">
        <div
          className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
            highlightedLine && highlightedLine !== "balance" ? "opacity-40" : "opacity-100"
          }`}
          onClick={() => handleLegendClick("balance")}
        >
          <span className="w-3 h-3 rounded-full bg-[#c9ff34]" />
          <span className="text-text-secondary text-xs hover:text-white transition-colors">Én</span>
        </div>
        <div
          className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
            highlightedLine && highlightedLine !== "averageProfitBalance"
              ? "opacity-40"
              : "opacity-100"
          }`}
          onClick={() => handleLegendClick("averageProfitBalance")}
        >
          <span className="w-3 h-3 rounded-full bg-[#626981]" />
          <span className="text-text-secondary text-xs hover:text-white transition-colors">
            Átlag
          </span>
        </div>
        {otherUsersData.map((user, index) => {
          const dataKey = `user_${user.userid}`;
          return (
            <div
              key={user.userid}
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
                highlightedLine && highlightedLine !== dataKey ? "opacity-40" : "opacity-100"
              }`}
              onClick={() => handleLegendClick(dataKey)}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-text-secondary text-xs hover:text-white transition-colors">
                {user.username}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ScoreByMatchChart;
