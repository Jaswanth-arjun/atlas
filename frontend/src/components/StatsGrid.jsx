import React from "react";

function Stat({ title, value }) {
  return (
    <div className="metric-tile">
      <div className="panel-muted">{title}</div>
      <div className="mt-1 text-xl font-semibold text-cyan-200">{value}</div>
    </div>
  );
}

export default function StatsGrid({ state }) {
  if (!state) return null;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <Stat title="Cash" value={`$${Math.round(state.cash_balance).toLocaleString()}`} />
      <Stat title="Revenue" value={`$${Math.round(state.revenue).toLocaleString()}`} />
      <Stat title="Burn Rate" value={`$${Math.round(state.burn_rate).toLocaleString()}`} />
      <Stat title="Morale" value={state.employee_morale.toFixed(1)} />
      <Stat title="Customer Sat" value={state.customer_satisfaction.toFixed(1)} />
    </div>
  );
}
