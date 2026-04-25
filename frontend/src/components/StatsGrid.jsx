import React from "react";

function Stat({ title, value, sub }) {
  return (
    <div className="metric-tile">
      <div className="panel-muted">{title}</div>
      <div className="mt-1 text-xl font-semibold text-cyan-200">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function StatsGrid({ state }) {
  if (!state) return null;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {/* Row 1 */}
      <Stat title="Cash" value={`$${Math.round(state.cash_balance).toLocaleString()}`} />
      <Stat title="Revenue" value={`$${Math.round(state.revenue).toLocaleString()}`} sub="/step" />
      <Stat title="Burn Rate" value={`$${Math.round(state.burn_rate).toLocaleString()}`} sub="/step" />
      <Stat title="Morale" value={`${state.employee_morale.toFixed(1)}%`} />
      <Stat title="Customer Sat" value={`${state.customer_satisfaction.toFixed(1)}%`} />
      {/* Row 2 — remaining 5 KPIs */}
      <Stat title="Investor Trust" value={`${state.investor_trust.toFixed(1)}%`} />
      <Stat title="Product Progress" value={`${state.product_progress.toFixed(1)}%`} />
      <Stat title="Pending Tasks" value={state.pending_tasks.toFixed(0)} />
      <Stat title="Active Crises" value={state.crises.toFixed(0)} />
      <Stat title="Market Trend" value={`${state.market_trend >= 0 ? "+" : ""}${state.market_trend.toFixed(1)}`} />
    </div>
  );
}
