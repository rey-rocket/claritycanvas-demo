"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/lib/theme-context";

type WorkloadChartProps = {
  designers: Array<{
    designerName: string;
    estimatedHours: number;
    hoursRemaining: number;
  }>;
};

export function WorkloadChart({ designers }: WorkloadChartProps) {
  const { theme } = useTheme();

  // Aggregate data
  const totalPlanned = designers.reduce((sum, d) => sum + d.estimatedHours, 0);
  const totalOver = designers.reduce(
    (sum, d) => sum + Math.max(0, -d.hoursRemaining),
    0
  );
  const totalUnder = designers.reduce(
    (sum, d) => sum + Math.max(0, d.hoursRemaining),
    0
  );

  const data = [
    { name: "At Capacity", value: totalPlanned - totalOver },
    { name: "Over Capacity", value: totalOver },
    { name: "Under Capacity", value: totalUnder }
  ].filter((d) => d.value > 0);

  // Brand-aligned colors
  const colors = {
    "At Capacity": "#2F7379", // cc-teal
    "Over Capacity": "#FF4A4A", // cc-red-pill
    "Under Capacity": "#ABCA20" // cc-lime
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={(entry) => `${entry.value.toFixed(0)}h`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.name as keyof typeof colors]} />
          ))}
        </Pie>
        <Legend
          wrapperStyle={{
            fontSize: "13px",
            color: "#6B7280" // cc-text-muted
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
