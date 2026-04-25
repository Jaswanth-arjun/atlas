import React, { useEffect, useMemo, useState } from "react";

import DecisionLog from "./components/DecisionLog";
import EmployeeMoodChart from "./components/EmployeeMoodChart";
import EventFeed from "./components/EventFeed";
import LeaderboardPanel from "./components/LeaderboardPanel";
import RevenueCashChart from "./components/RevenueCashChart";
import RewardChart from "./components/RewardChart";
import StatsGrid from "./components/StatsGrid";
import { api } from "./services/api";
import { connectWS } from "./services/ws";

const MAX_POINTS = 120;
const NAV_ITEMS = ["Dashboard", "Overview", "Analytics", "Decisions", "Market", "Team", "Reports", "Settings"];

export default function App() {
  const [state, setState] = useState(null);
  const [mode, setMode] = useState("startup");
  const [done, setDone] = useState(false);
  const [episodeId, setEpisodeId] = useState(null);
  const [events, setEvents] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [moraleHistory, setMoraleHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeNav, setActiveNav] = useState("Dashboard");

  useEffect(() => {
    boot();
    const ws = connectWS((data) => {
      if (data.type === "state_update") {
        const payload = data.payload;
        setState(payload.state);
        setEpisodeId(payload.episode_id ?? null);
        setDecisions((d) =>
          [{ day: payload.day, phase: payload.phase, action: payload.action }, ...d].slice(0, 30),
        );
        setHistory((h) =>
          [
            ...h,
            { step: h.length + 1, revenue: payload.state.revenue, cash: payload.state.cash_balance },
          ].slice(-MAX_POINTS),
        );
        setMoraleHistory((m) =>
          [...m, { name: `S${payload.day}`, mood: payload.state.employee_morale }].slice(-10),
        );
      }
      if (data.type === "market_event" && data.payload?.event) {
        setEvents((e) => [data.payload.event, ...e].slice(0, 30));
      }
      if (data.type === "reward_update") {
        setRewards((r) => [...r, { step: r.length + 1, reward: data.payload.reward }].slice(-MAX_POINTS));
      }
      if (data.type === "episode_done") {
        setDone(true);
        loadLeaderboard();
      }
    });
    return () => ws.close();
  }, []);

  async function boot() {
    try {
      const current = await api.getState();
      setState(current.data.state);
      setEpisodeId(current.data.episode_id);
      setMoraleHistory([{ name: "S1", mood: current.data.state.employee_morale }]);
      loadLeaderboard();
    } catch (_error) {
      // Keep app responsive even if one boot call fails temporarily.
    }
  }

  async function loadLeaderboard() {
    const lb = await api.leaderboard();
    setLeaderboard(lb.data || []);
  }

  async function onReset() {
    const resetRes = await api.reset(mode);
    setState(resetRes.data.state);
    setEpisodeId(resetRes.data.episode_id);
    setEvents([]);
    setDecisions([]);
    setRewards([]);
    setHistory([]);
    setMoraleHistory([{ name: "S1", mood: resetRes.data.state.employee_morale }]);
    setDone(false);
    await loadLeaderboard();
  }

  async function onReplay(id) {
    const replayRes = await api.replay(id);
    const steps = replayRes.data || [];
    setEvents([]);
    setDecisions([]);
    setRewards([]);
    setHistory([]);
    setMoraleHistory([]);
    setDone(false);

    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      // Keep replay smooth and readable for demo mode.
      await new Promise((resolve) => setTimeout(resolve, 200));
      setState(step.state);
      setDecisions((d) => [{ day: step.day, phase: step.phase, action: step.action }, ...d].slice(0, 30));
      setRewards((r) => [...r, { step: r.length + 1, reward: step.reward }].slice(-MAX_POINTS));
      setHistory((h) =>
        [...h, { step: h.length + 1, revenue: step.state.revenue, cash: step.state.cash_balance }].slice(
          -MAX_POINTS,
        ),
      );
      setMoraleHistory((m) =>
        [...m, { name: `S${step.day}`, mood: step.state.employee_morale }].slice(-10),
      );
      if (step.event?.name) {
        setEvents((e) => [step.event.name, ...e].slice(0, 30));
      }
    }
    setDone(true);
  }

  function exportCsv() {
    const rows = ["step,revenue,cash"];
    history.forEach((row) => rows.push(`${row.step},${row.revenue},${row.cash}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `atlas_metrics_episode_${episodeId || "latest"}.csv`;
    anchor.click();
  }

  const mood = useMemo(() => moraleHistory, [moraleHistory]);

  useEffect(() => {
    const sectionMap = [
      { id: "section-dashboard", nav: "Dashboard" },
      { id: "section-overview", nav: "Overview" },
      { id: "section-analytics", nav: "Analytics" },
      { id: "section-decisions", nav: "Decisions" },
      { id: "section-market", nav: "Market" },
      { id: "section-team", nav: "Team" },
      { id: "section-reports", nav: "Reports" },
      { id: "section-settings", nav: "Settings" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = sectionMap.find((section) => section.id === visible.target.id);
        if (match) setActiveNav(match.nav);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -50% 0px" },
    );

    sectionMap.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  function goToSection(item) {
    const targetId = `section-${item.toLowerCase()}`;
    const node = document.getElementById(targetId);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveNav(item);
    }
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-grid">
        <aside className="sidebar-panel">
          <div className="mb-8">
            <div className="text-2xl font-bold tracking-wide text-cyan-300">ATLAS</div>
            <div className="mt-1 text-xs text-slate-400">AI CEO Dashboard</div>
          </div>

          <nav className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => goToSection(item)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                  activeNav === item
                    ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-200"
                    : "border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800/30"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3 text-xs">
            <div className="text-emerald-300">System Status</div>
            <div className="font-medium text-emerald-200">Online</div>
          </div>
        </aside>

        <main className="main-panel">
          <header id="section-dashboard" className="glass-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100">
                Day 45 &middot; Afternoon Phase
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="top-button"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="startup">Startup</option>
                  <option value="crisis">Crisis</option>
                  <option value="growth">Growth</option>
                </select>
                <button className="top-button" onClick={onReset}>
                  Reset Simulation
                </button>
                <button className="top-button" onClick={exportCsv}>
                  Download CSV
                </button>
                {episodeId && (
                  <a className="top-button-primary" href={api.investorReport(episodeId)} target="_blank">
                    Generate Report
                  </a>
                )}
              </div>
            </div>
          </header>

          <section id="section-overview">
            <StatsGrid state={state} />
          </section>

          <section id="section-analytics" className="grid gap-4 lg:grid-cols-2">
            <RevenueCashChart data={history} />
            <RewardChart data={rewards} />
          </section>

          <section id="section-team">
            <EmployeeMoodChart
              data={mood}
              currentMorale={state?.employee_morale ?? 0}
              currentSatisfaction={state?.customer_satisfaction ?? 0}
            />
          </section>

          <section id="section-decisions" className="grid gap-4 lg:grid-cols-2">
            <DecisionLog decisions={decisions} done={done} />
            <div id="section-market">
              <EventFeed events={events} />
            </div>
          </section>

          <section id="section-reports">
            <LeaderboardPanel rows={leaderboard} onReplay={onReplay} onPdf={api.investorReport} />
          </section>

          <section id="section-settings" className="glass-card">
            <div className="panel-title mb-1">Settings</div>
            <p className="text-sm text-slate-400">Use the controls in the top bar to change mode, reset, export CSV, and generate report.</p>
          </section>
        </main>
      </div>
    </div>
  );
}
