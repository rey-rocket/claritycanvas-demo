"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "@/lib/theme-context";

type CapacityRingProps = {
  capacity: number;
  used: number;
  size?: number;
};

export function CapacityRing({ capacity, used, size = 120 }: CapacityRingProps) {
  const { theme } = useTheme();
  const remaining = Math.max(0, capacity - used);
  const overCapacity = Math.max(0, used - capacity);

  const data = [
    { name: "Used", value: Math.min(used, capacity) },
    { name: "Remaining", value: remaining },
    { name: "Over", value: overCapacity }
  ].filter((d) => d.value > 0);

  // Brand-aligned colors
  const colors = {
    used: "#2F7379", // cc-teal
    remaining: "#E5E7EB", // cc-border-subtle
    over: "#FF4A4A" // cc-red-pill
  };

  const getColor = (name: string) => {
    if (name === "Over") return colors.over;
    if (name === "Used") return overCapacity > 0 ? colors.over : colors.used;
    return colors.remaining;
  };

  const percentage = capacity > 0 ? Math.round((used / capacity) * 100) : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.45}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display text-cc-teal-dark">
          {percentage}%
        </span>
        <span className="text-xs text-cc-text-muted uppercase tracking-wide">capacity</span>
      </div>
    </div>
  );
}
