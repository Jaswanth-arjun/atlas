import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function EventFeed({ events }) {
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0 };
    events.forEach((event) => {
      const text = String(event || "").toLowerCase();
      if (text.includes("outage") || text.includes("spike") || text.includes("churn")) {
        counts.Critical += 1;
      } else if (text.includes("dropped") || text.includes("volatility") || text.includes("limit")) {
        counts.High += 1;
      } else {
        counts.Medium += 1;
      }
    });
    return [
      { name: "Critical", value: counts.Critical, color: "#fb7185" },
      { name: "High", value: counts.High, color: "#f59e0b" },
      { name: "Medium", value: counts.Medium, color: "#22d3ee" },
    ];
  }, [events]);

  return (
    <div className="glass-card h-80">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="panel-title mb-0">Crisis Alerts</h2>
        <span className="text-xs text-rose-300">Live Feed</span>
      </div>
      <div className="grid h-[90%] grid-cols-[155px_1fr] gap-3">
        <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={52} paddingAngle={2}>
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-auto">
          <ul className="space-y-1 text-sm">
            {events.map((event, index) => (
              <li key={index} className="rounded-lg border border-rose-400/20 bg-rose-400/5 px-2 py-1 text-rose-200">
                {event}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
