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
  Legend,
} from "recharts";
import Loader from "../Loader";
import { playersKeys, useBalanceHistory } from "@/hooks/api/usePlayers";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { DailyBalanceChange } from "@/services/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: DailyBalanceChange;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload._id;
    const positiveBalance = payload.find((p) => p.dataKey === "positiveBalance")?.value || 0;
    const negativeBalance = payload.find((p) => p.dataKey === "negativeBalance")?.value || 0;
    const balance = payload.find((p) => p.dataKey === "balance")?.value || 0;

    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-text-secondary text-sm mb-2 font-medium">{date}</p>
        <div className="space-y-1">
          <p className="text-success text-sm">
            <span className="font-semibold">Bevétel:</span> +{positiveBalance} Ft
          </p>
          <p className="text-error text-sm">
            <span className="font-semibold">Kiadás:</span> {negativeBalance} Ft
          </p>
          <div className="border-t border-accent/20 mt-2 pt-2">
            <p className={`font-semibold ${balance >= 0 ? "text-success" : "text-error"}`}>
              Egyenleg: {balance >= 0 ? "+" : ""}
              {balance} Ft
            </p>
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
}

export const BalanceHistoryChart = ({ from, to, userId }: BalanceHistoryChartProps) => {
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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          iconType="rect"
          formatter={(value) => {
            const labels: Record<string, string> = {
              positiveBalance: "Bevétel",
              negativeBalance: "Kiadás",
              balance: "Napi egyenleg",
            };
            return <span style={{ color: "#b6b1d4" }}>{labels[value] || value}</span>;
          }}
        />
        <ReferenceLine y={0} stroke="#b6b1d4" strokeWidth={2} strokeDasharray="3 3" />
        <Bar
          dataKey="positiveBalance"
          fill="url(#positiveGradient)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
        <Bar
          dataKey="negativeBalance"
          fill="url(#negativeGradient)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
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
