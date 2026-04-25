import React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RewardChart({ data }) {
  return (
    <div className="chart-card">
      <div className="panel-title">AI Performance</div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rewardFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
          <XAxis dataKey="step" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="reward"
            stroke="#c084fc"
            fill="url(#rewardFill)"
            strokeWidth={2.8}
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
