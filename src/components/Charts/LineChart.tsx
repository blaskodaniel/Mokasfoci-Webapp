import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { BalanceHistoryEntry } from "@/services/types";
import { useBalanceHistory } from "@/hooks/api/usePlayers";
import Loader from "../Loader";
import { format } from "date-fns";
import { IoStatsChart } from "react-icons/io5";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: BalanceHistoryEntry;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-text-secondary text-sm mb-1">{data.payload.date}</p>
        <p className="text-accent font-semibold text-lg">{data.value} pont</p>
      </div>
    );
  }
  return null;
};

interface BalanceHistoryChartProps {
  from?: string;
  to?: string;
}

export const BalanceHistoryChart = ({ from, to }: BalanceHistoryChartProps) => {
  const { data, isLoading, isError } = useBalanceHistory(from, to);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Betöltés..." />
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-text-secondary">
        <IoStatsChart size={48} className="opacity-20" />
        <span className="text-sm">Még nincs megjeleníthető adat</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2543" vertical={false} />
        <XAxis
          dataKey="_id"
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
          tickFormatter={(value) => `${format(new Date(value), "MM/dd")}`}
        />
        <YAxis
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          dot={{
            fill: "#4ade80",
            strokeWidth: 2,
            r: 4,
            stroke: "#1f1a35",
          }}
          activeDot={{
            r: 6,
            fill: "#22d3ee",
            stroke: "#1f1a35",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
