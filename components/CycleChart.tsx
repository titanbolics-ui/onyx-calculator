"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { BloodLevel } from "@/lib/math";

interface CycleChartProps {
  data: BloodLevel[];
}

export default function CycleChart({ data }: CycleChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600 font-mono text-sm">
        Adjust parameters to generate simulation
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ccff00" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#ccff00" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          stroke="#333"
          tick={{ fill: "#666", fontSize: 11, fontFamily: "monospace" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "DAY",
            position: "insideBottomRight",
            offset: -5,
            fill: "#555",
            fontSize: 10,
            fontFamily: "monospace",
          }}
        />
        <YAxis
          stroke="#333"
          tick={{ fill: "#666", fontSize: 11, fontFamily: "monospace" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "mg",
            position: "insideTopLeft",
            offset: -5,
            fill: "#555",
            fontSize: 10,
            fontFamily: "monospace",
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: 12,
          }}
          labelStyle={{ color: "#888" }}
          itemStyle={{ color: "#ccff00" }}
          formatter={(value?: number) => [`${value ?? 0} mg`, "Blood Level"]}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area
          type="monotone"
          dataKey="level"
          stroke="#ccff00"
          strokeWidth={2}
          fill="url(#levelGradient)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "#ccff00",
            stroke: "#0a0a0a",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
