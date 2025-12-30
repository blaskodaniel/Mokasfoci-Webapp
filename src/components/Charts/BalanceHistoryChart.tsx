import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";
import Loader from "../Loader";
import { playersKeys, useBalanceHistory } from "@/hooks/api/usePlayers";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface DailyBalanceChange {
  _id: string;
  balance: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DailyBalanceChange;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isPositive = data.value >= 0;
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-text-secondary text-sm mb-1">{data.payload._id}</p>
        <p className={`font-semibold text-lg ${isPositive ? "text-success" : "text-error"}`}>
          {isPositive ? "+" : ""}
          {data.value} Ft
        </p>
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
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useBalanceHistory(from, to);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: playersKeys.getBalanceHistory() });
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Betöltés..." />
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Nincs megjeleníthető adat
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="negativeGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2543" vertical={false} />
        <XAxis
          dataKey="_id"
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
        />
        <YAxis
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
          tickFormatter={(value) => `${value} Ft`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2a2543", opacity: 0.3 }} />
        <ReferenceLine y={0} stroke="#b6b1d4" strokeWidth={2} strokeDasharray="3 3" />
        <Bar dataKey="balance" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.balance >= 0 ? "url(#positiveGradient)" : "url(#negativeGradient)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
