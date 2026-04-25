import React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueCashChart({ data }) {
  return (
    <div className="chart-card">
      <div className="panel-title">Financial Overview</div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
          <XAxis dataKey="step" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#2dd4bf"
            fill="url(#revenueFill)"
            strokeWidth={2.6}
            dot={false}
            isAnimationActive
            animationDuration={280}
            animationEasing="linear"
          />
          <Area
            type="monotone"
            dataKey="cash"
            name="Cash Balance"
            stroke="#60a5fa"
            fill="url(#cashFill)"
            strokeWidth={2.6}
            dot={false}
            isAnimationActive
            animationDuration={280}
            animationEasing="linear"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
