import React from "react";

export default function DecisionLog({ decisions, done }) {
  return (
    <div className="glass-card h-80 overflow-auto">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="panel-title mb-0">CEO Decisions Log</h2>
        <span className="text-xs text-slate-400">Recent Actions</span>
      </div>
      <ul className="space-y-1 text-sm">
        {decisions.map((decision, index) => (
          <li key={index} className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2 py-1">
            <span className="text-slate-300">
              Day {decision.day} {decision.phase}:
            </span>{" "}
            <span className="text-cyan-300">{decision.action}</span>
          </li>
        ))}
      </ul>
      {done && <p className="mt-4 text-emerald-300 font-semibold">Episode complete.</p>}
    </div>
  );
}
