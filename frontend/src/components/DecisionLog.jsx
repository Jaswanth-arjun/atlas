import React from "react";

export default function DecisionLog({ decisions, done }) {
  return (
    <div className="card h-72 overflow-auto">
      <h2 className="font-semibold mb-2">CEO Decisions Log</h2>
      <ul className="space-y-1 text-sm">
        {decisions.map((decision, index) => (
          <li key={index}>
            Day {decision.day} {decision.phase}:{" "}
            <span className="text-cyan-300">{decision.action}</span>
          </li>
        ))}
      </ul>
      {done && <p className="mt-4 text-emerald-300 font-semibold">Episode complete.</p>}
    </div>
  );
}
