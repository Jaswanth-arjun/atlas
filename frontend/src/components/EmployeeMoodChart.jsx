import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MetricPie({ title, value, toneClass }) {
  const bounded = Math.max(0, Math.min(100, value));
  const pieData = [
    { name: title, value: bounded, color: "#22d3ee" },
    { name: "Remaining", value: Math.max(0, 100 - bounded), color: "#1e293b" },
  ];

  return (
    <div className="flex-1 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-2 py-2">
      <div className="text-center text-[10px] uppercase tracking-wider text-slate-400">{title}</div>
      <div className="mt-1 h-[90px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={24}
              outerRadius={38}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {pieData.map((slice) => (
                <Cell key={`${title}-${slice.name}`} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={`text-center text-2xl font-semibold ${toneClass}`}>{Math.round(bounded)}%</div>
    </div>
  );
}

export default function EmployeeMoodChart({ data, currentMorale, currentSatisfaction }) {
  const boundedMorale = Math.max(0, Math.min(100, currentMorale));
  const boundedSatisfaction = Math.max(0, Math.min(100, currentSatisfaction));
  const moraleToneClass =
    boundedMorale >= 75 ? "text-emerald-300" : boundedMorale >= 50 ? "text-cyan-300" : "text-amber-300";
  const satisfactionToneClass =
    boundedSatisfaction >= 75
      ? "text-emerald-300"
      : boundedSatisfaction >= 50
        ? "text-cyan-300"
        : "text-amber-300";
  const chartData =
    Array.isArray(data) && data.length > 0
      ? data
      : [
          { name: "S1", mood: boundedMorale },
        ];

  return (
    <div className="chart-card">
      <div className="panel-title">Employee Morale</div>
      <div className="grid h-[90%] grid-cols-[1fr_350px] gap-3">
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={14}>
              <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="mood"
                fill="#22d3ee"
                radius={[8, 8, 0, 0]}
                maxBarSize={34}
                minPointSize={3}
                isAnimationActive
                animationDuration={280}
                animationEasing="linear"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-2 py-3">
          <div className="flex gap-2">
            <MetricPie title="Current Morale" value={boundedMorale} toneClass={moraleToneClass} />
            <MetricPie title="Customer Sat" value={boundedSatisfaction} toneClass={satisfactionToneClass} />
          </div>
          <div className="mt-2 text-center text-xs text-slate-400">Live confidence and customer satisfaction</div>
        </div>
      </div>
    </div>
  );
}
