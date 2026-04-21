import React from "react";

function Stat({ title, value }) {
  return (
    <div className="card">
      <div className="text-slate-400 text-xs">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function StatsGrid({ state }) {
  if (!state) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat title="Cash" value={`$${Math.round(state.cash_balance).toLocaleString()}`} />
      <Stat title="Revenue" value={`$${Math.round(state.revenue).toLocaleString()}`} />
      <Stat title="Burn Rate" value={`$${Math.round(state.burn_rate).toLocaleString()}`} />
      <Stat title="Morale" value={state.employee_morale.toFixed(1)} />
      <Stat title="Customer Sat" value={state.customer_satisfaction.toFixed(1)} />
    </div>
  );
}
