import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import Loader from "../Loader";
import { playersKeys, useBalanceHistory } from "@/hooks/api/usePlayers";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { BalanceHistoryEntry } from "@/services/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: BalanceHistoryEntry;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.date;
    const dailyBalance = payload.find((p) => p.dataKey === "dailyBalance")?.value || 0;
    const balance = payload.find((p) => p.dataKey === "balance")?.value || 0;

    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-text-secondary text-sm mb-2 font-medium">{date}</p>
        <div className="space-y-1">
          <div className="border-t border-accent/20 mt-2 pt-2">
            <p className={`font-semibold ${balance >= 0 ? "text-success" : "text-error"}`}>
              Egyenleg: {balance >= 0 ? "+" : ""}
              {balance} Ft
            </p>
            {dailyBalance !== 0 && (
              <p className={`text-sm ${dailyBalance >= 0 ? "text-success" : "text-error"}`}>
                Napi változás: {dailyBalance >= 0 ? "+" : ""}
                {dailyBalance} Ft
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface BalanceHistoryChartProps {
  from?: string;
  to?: string;
  userId?: string;
  height?: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export const BalanceHistoryChart = ({
  from,
  to,
  userId,
  height = 300,
  showXAxis = true,
  showYAxis = true,
}: BalanceHistoryChartProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useBalanceHistory(from, to, userId);

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

  const balances = data.map((d) => d.balance);
  const maxBalance = Math.max(...balances);
  const minBalance = Math.min(...balances);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
          dataKey="date"
          hide={!showXAxis}
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
        />
        <YAxis
          hide={!showYAxis}
          stroke="#b6b1d4"
          tick={{ fill: "#b6b1d4", fontSize: 12 }}
          tickLine={{ stroke: "#2a2543" }}
          tickFormatter={(value) => `${value} Ft`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2a2543", opacity: 0.3 }} />

        <ReferenceLine y={0} stroke="#b6b1d4" strokeWidth={2} strokeDasharray="3 3" />
        <ReferenceLine
          y={maxBalance}
          label={{
            position: "top",
            value: `Max: ${maxBalance.toFixed(2)}`,
            fill: "#ffffff",
            fontSize: 12,
          }}
          stroke="#8b5cf6"
          strokeDasharray="3 3"
          opacity={0.5}
        />
        <ReferenceLine
          y={minBalance}
          label={{
            position: "bottom",
            value: `Min: ${minBalance.toFixed(2)}`,
            fill: "#ffffff",
            fontSize: 12,
          }}
          stroke="#8b5cf6"
          strokeDasharray="3 3"
          opacity={0.5}
        />
        <Bar dataKey="dailyBalance" radius={[4, 4, 0, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.dailyBalance >= 0 ? "url(#positiveGradient)" : "url(#negativeGradient)"}
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
