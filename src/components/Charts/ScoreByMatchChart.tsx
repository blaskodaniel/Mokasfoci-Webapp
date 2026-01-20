/* eslint-disable @typescript-eslint/no-explicit-any */
import { useScoreByMatches } from "@/hooks/api/usePlayers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import Loader from "../Loader";
import { format } from "date-fns";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: any;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-text-secondary text-sm mb-2 font-medium">
          {data.teamA} vs {data.teamB}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-text-secondary">Felhasználható:</span>{" "}
            <span className="font-semibold text-blue-400">{data.availableScore}</span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">Nyeremény:</span>{" "}
            <span className="font-semibold text-purple-400">{data.profitScore}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ScoreByMatchChart = () => {
  const { data: scoreByMatches, isLoading, error } = useScoreByMatches();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Betöltés..." />
      </div>
    );
  }

  if (error || !scoreByMatches || scoreByMatches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Nincs megjeleníthető adat
      </div>
    );
  }

  // Adatok formázása a charthoz - rövidebb címkék a mérkőzésekhez
  const chartData = scoreByMatches.map((match) => ({
    ...match,
    displayName: `${format(new Date(match.matchDate), "MMM dd")}`,
  }));

  const scores = chartData.map((d) => d.availableScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="availableScoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60fafaff" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#60fafaff" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="profitScoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#60fafaff" vertical={false} />
        <XAxis
          dataKey="displayName"
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#60fafaff" }}
          label={{ value: "Mérkőzések", position: "insideBottom", offset: -5, fill: "#b6b1d4" }}
        />
        <YAxis
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
          label={{ value: "Pontok", angle: -90, position: "insideLeft", fill: "#b6b1d4" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
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
        />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          iconType="line"
          formatter={(value) => {
            const labels: Record<string, string> = {
              availableScore: "Elérhető pont",
              profitScore: "Megszerzett pont",
            };
            return <span style={{ color: "#b6b1d4" }}>{labels[value] || value}</span>;
          }}
        />
        <Line
          type="monotone"
          dataKey="availableScore"
          stroke="#60fafaff"
          strokeWidth={2}
          dot={{ fill: "#60fafaff", r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="profitScore"
          stroke="#a78bfa"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreByMatchChart;
