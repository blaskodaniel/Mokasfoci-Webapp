/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useWinLostStats } from "@/hooks/api/usePlayers";
import Loader from "../Loader";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      percentage: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-text-primary font-semibold mb-1">{data.name}</p>
        <p className="text-accent text-lg">{data.value} tipp</p>
        <p className="text-text-secondary text-sm">{data.payload.percentage}</p>
      </div>
    );
  }
  return null;
};

export const WinLostChart = ({ userId }: { userId?: string }) => {
  const { data, isLoading, isError } = useWinLostStats(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Betöltés..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Nincs megjeleníthető adat
      </div>
    );
  }

  const total = data.won + data.lost;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Még nincs tipp
      </div>
    );
  }

  const chartData = [
    {
      name: "Nyert",
      value: data.won,
      percentage: `${data.winRatePercentage.toFixed(1)}%`,
    },
    {
      name: "Veszített",
      value: data.lost,
      percentage: `${(100 - data.winRatePercentage).toFixed(1)}%`,
    },
  ];

  const renderCustomLabel = (props: any) => {
    return props.percentage;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              <linearGradient id="wonGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="lostGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "url(#wonGradient)" : "url(#lostGradient)"}
                  stroke="#1f1a35"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{
                paddingTop: "0px",
              }}
              formatter={(value, entry: any) => (
                <span className="text-text-primary">{`${value}: ${entry.payload.value}`}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        text-center pointer-events-none"
        >
          <p className="text-text-secondary text-xs mb-1">Nyerési arány</p>
          <p className="text-accent text-3xl font-bold">{data.winRatePercentage.toFixed(1)}%</p>
          <p className="text-text-secondary text-xs mt-1">
            {data.won} / {total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinLostChart;
