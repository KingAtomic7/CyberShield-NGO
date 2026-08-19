"use client";

import type { ReactNode } from "react";

type RiskLevel = "critical" | "high" | "medium" | "low";
export const riskBg: Record<RiskLevel, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};
export const riskColors: Record<RiskLevel, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};
export const maturityLabels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];

export interface DashboardTabProps {
  score: number;
  riskLevel: RiskLevel;
  maturityLevel: number;
  dist: Record<RiskLevel, number>;
  roadmapProgress: number;
  assessment: any;
  answers: any[];
  riskResults: any[];
  recs: any[];
  roadmapItems: any[];
  kpiData: any[];
  gaps: any[];
  costCategories: any[];
  updateRoadmap: (id: string, status: string) => void;
  updateRecStatus: (id: string, status: string) => void;
  updateKPI: (id: string, currentValue: number) => void;
}

export function OverviewTab({ score, riskLevel, maturityLevel, dist, roadmapProgress, riskResults, roadmapItems }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500 mb-1">Security Score</p><p className={`text-3xl font-bold ${riskColors[riskLevel]}`}>{score}<span className="text-sm text-gray-400">/100</span></p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500 mb-1">Risk Level</p><p className="text-lg font-semibold"><span className={`px-2 py-1 rounded-full text-xs font-bold ${riskBg[riskLevel]}`}>{riskLevel.toUpperCase()}</span></p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500 mb-1">Maturity Level</p><p className="text-lg font-semibold text-blue-600">Level {maturityLevel} – {maturityLabels[maturityLevel]}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500 mb-1">Roadmap Progress</p><p className="text-3xl font-bold text-green-600">{roadmapProgress}%</p></div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => (
          <div key={level} className={`rounded-xl p-4 border ${level === "critical" ? "bg-red-50 border-red-200" : level === "high" ? "bg-orange-50 border-orange-200" : level === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
            <p className={`text-xs mb-1 ${riskColors[level]}`}>{level[0].toUpperCase() + level.slice(1)} Risks</p><p className={`text-2xl font-bold ${riskColors[level]}`}>{dist[level]}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-chart-radar mr-2 text-blue-500"></i>Category Scores</h3><canvas id="radarChart" height="250"></canvas></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-chart-pie mr-2 text-blue-500"></i>Risk Distribution</h3><canvas id="doughnutChart" height="250"></canvas></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-layer-group mr-2 text-blue-500"></i>Maturity: Current vs Target</h3><canvas id="maturityChart" height="200"></canvas><p className="text-sm text-gray-500 mt-2">Current: Level {maturityLevel} ({maturityLabels[maturityLevel]}) → Target: Level {Math.min(maturityLevel + 1, 5)} ({maturityLabels[Math.min(maturityLevel + 1, 5)]})</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-tasks mr-2 text-blue-500"></i>Implementation Progress</h3>{roadmapItems.length > 0 ? <canvas id="roadmapChart" height="200"></canvas> : <p className="text-gray-500">No roadmap items yet. Complete an assessment first.</p>}<div className="mt-3"><div className="flex justify-between text-xs mb-1"><span>Overall Progress</span><span>{roadmapProgress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 rounded-full h-2" style={{ width: `${roadmapProgress}%` }} /></div></div></div>
      </div>
      {riskResults.length > 0 && <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-list-alt mr-2 text-blue-500"></i>Category Breakdown</h3><div className="space-y-3">{riskResults.map((r: any) => <div key={r.id ?? r.category} className="flex items-center gap-3"><span className="w-48 text-sm text-gray-700 flex-shrink-0">{r.category}</span><div className="flex-1 bg-gray-200 rounded-full h-4"><div className={`rounded-full h-4 ${r.categoryScore >= 80 ? "bg-green-500" : r.categoryScore >= 60 ? "bg-cyan-500" : r.categoryScore >= 40 ? "bg-yellow-500" : r.categoryScore >= 20 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${r.categoryScore}%` }} /></div><span className="w-12 text-sm font-medium text-right">{r.categoryScore}%</span><span className={`px-2 py-0.5 rounded text-xs font-bold ${riskBg[(r.riskLevel || "medium") as RiskLevel]}`}>{(r.riskLevel || "medium").toUpperCase()}</span></div>)}</div></div>}
    </div>
  );
}

export function RisksTab({ answers }: DashboardTabProps) {
  const sortedAnswers = answers
    .filter((a: any) => a.answer !== "not_applicable" && a.answer !== "fully_implemented")
    .slice()
    .sort((a: any, b: any) => b.riskScore - a.riskScore);
  return <div className="space-y-4"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">Risk Assessment Results</h3>{answers.length === 0 ? <p className="text-gray-500">No assessment data. Complete an assessment first.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Question</th><th className="p-2">Answer</th><th className="p-2">Risk Score</th><th className="p-2">Risk Level</th></tr></thead><tbody>{sortedAnswers.map((a: any) => <tr key={a.id ?? a.questionId} className="border-b hover:bg-gray-50"><td className="p-2 max-w-xs truncate">{a.questionText}</td><td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs ${a.answer === "not_implemented" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{a.answer.replace(/_/g, " ")}</span></td><td className="p-2 text-center font-bold">{a.riskScore}</td><td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${riskBg[(a.riskLevel || "medium") as RiskLevel]}`}>{(a.riskLevel || "medium").toUpperCase()}</span></td></tr>)}</tbody></table></div>}</div></div>;
}

export function GapTab({ gaps }: DashboardTabProps) {
  return <div className="space-y-4"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-search mr-2"></i>Gap Analysis</h3>{gaps.length === 0 ? <p className="text-gray-500">No gaps identified. Complete an assessment first.</p> : <div className="space-y-3">{gaps.map((g: any, i: number) => <div key={i} className="border rounded-lg p-4" style={{ borderLeftColor: g.risk === "critical" ? "#dc2626" : g.risk === "high" ? "#ea580c" : g.risk === "medium" ? "#ca8a04" : "#16a34a", borderLeftWidth: "4px" }}><div className="flex items-start justify-between mb-2"><span className="font-medium text-sm">{g.category}</span><div className="flex gap-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${riskBg[(g.risk || "medium") as RiskLevel]}`}>{(g.risk || "medium").toUpperCase()}</span><span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{(g.priority || "short_term").replace(/_/g, " ").toUpperCase()}</span></div></div><div className="grid md:grid-cols-2 gap-2 text-sm"><div><span className="text-gray-500">Current: </span><span className="text-red-600">{g.currentState}</span></div><div><span className="text-gray-500">Expected: </span><span className="text-green-600">{g.expectedState}</span></div></div><p className="text-sm text-gray-600 mt-2"><i className="fas fa-arrow-right mr-1"></i>{g.recommendation}</p></div>)}</div>}</div></div>;
}

export function RecsTab({ recs, updateRecStatus }: DashboardTabProps) {
  const sortedRecs = recs.slice().sort((a: any, b: any) => {
    const prioOrder: Record<string, number> = { immediate: 0, short_term: 1, medium_term: 2, long_term: 3 };
    return (prioOrder[a.priority] ?? 2) - (prioOrder[b.priority] ?? 2);
  });
  return <div className="space-y-4"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-2"><i className="fas fa-lightbulb mr-2"></i>Prioritized Recommendations</h3><p className="text-sm text-gray-500 mb-4">Ordered by priority: Risk × Business Impact / Implementation Effort</p>{sortedRecs.length === 0 ? <p className="text-gray-500">No recommendations. Complete an assessment first.</p> : <div className="space-y-3">{sortedRecs.map((r: any) => <div key={r.id} className="border rounded-lg p-4 hover:bg-gray-50" style={{ borderLeftColor: r.risk === "critical" ? "#dc2626" : r.risk === "high" ? "#ea580c" : r.risk === "medium" ? "#ca8a04" : "#16a34a", borderLeftWidth: "4px" }}><div className="flex items-start justify-between"><h4 className="font-medium text-sm">{r.title}</h4><select value={r.status || "pending"} onChange={(e) => updateRecStatus(r.id, e.target.value)} className="text-xs border rounded px-2 py-1 ml-2 flex-shrink-0"><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="deferred">Deferred</option></select></div><p className="text-xs text-gray-500 mt-1">{r.description}</p><div className="flex flex-wrap gap-2 mt-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${riskBg[(r.risk || "medium") as RiskLevel]}`}>{(r.risk || "medium").toUpperCase()}</span><span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{(r.priority || "short_term").replace(/_/g, " ").toUpperCase()}</span><span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"><i className="fas fa-coins mr-1"></i>{r.costEstimate}</span><span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"><i className="fas fa-clock mr-1"></i>{r.implementationTime}</span></div></div>)}</div>}</div></div>;
}

export function RoadmapTab({ roadmapItems, roadmapProgress, updateRoadmap }: DashboardTabProps) {
  const phases = [
    { key: "first_30_days", label: "First 30 Days", icon: "fa-bolt", color: "border-red-500 bg-red-50", desc: "Immediate quick wins" },
    { key: "30_to_90_days", label: "30-90 Days", icon: "fa-tools", color: "border-orange-500 bg-orange-50", desc: "Short-term improvements" },
    { key: "3_to_6_months", label: "3-6 Months", icon: "fa-cogs", color: "border-yellow-500 bg-yellow-50", desc: "Medium-term initiatives" },
    { key: "6_to_12_months", label: "6-12 Months", icon: "fa-rocket", color: "border-green-500 bg-green-50", desc: "Long-term strategic goals" },
  ];
  return <div className="space-y-6"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-2"><i className="fas fa-road mr-2"></i>Implementation Roadmap</h3><div className="mb-4"><div className="flex justify-between text-sm mb-1"><span>Overall Progress</span><span className="font-bold">{roadmapProgress}%</span></div><div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 rounded-full h-3 transition-all" style={{ width: `${roadmapProgress}%` }} /></div></div></div>{phases.map(phase => { const items = roadmapItems.filter((r: any) => r.phase === phase.key); const completed = items.filter((r: any) => r.status === "completed").length; return <div key={phase.key} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${phase.color}`}><div className="flex items-center justify-between mb-4"><div><h4 className="font-semibold"><i className={`fas ${phase.icon} mr-2`}></i>{phase.label}</h4><p className="text-xs text-gray-500">{phase.desc}</p></div><span className="text-sm font-bold text-gray-600">{completed}/{items.length}</span></div><div className="space-y-2">{items.map((item: any) => <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"><select value={item.status} onChange={(e) => updateRoadmap(item.id, e.target.value)} className="text-xs border rounded px-2 py-1"><option value="not_started">Not Started</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><span className={`text-sm ${item.status === "completed" ? "line-through text-gray-400" : ""}`}>{item.title}</span></div>)}</div></div>; })}</div>;
}

export function KpiTab({ kpiData, updateKPI }: DashboardTabProps) {
  return <div className="space-y-4"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4"><i className="fas fa-chart-bar mr-2"></i>Security KPI Dashboard</h3>{kpiData.length === 0 ? <p className="text-gray-500">No KPIs. Complete an assessment first.</p> : <div className="grid md:grid-cols-2 gap-4">{kpiData.map((kpi: any) => { const isInverse = kpi.name === "Phishing Click Rate"; const progress = isInverse ? Math.max(0, Math.round(((kpi.targetValue || 0) / Math.max(kpi.currentValue, 1)) * 100)) : Math.round((kpi.currentValue / Math.max(kpi.targetValue, 1)) * 100); const clampedProgress = Math.min(100, Math.max(0, progress)); return <div key={kpi.id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-2"><span className="font-medium text-sm">{kpi.name}</span><span className="text-xs text-gray-500">{kpi.category}</span></div><div className="flex items-center gap-4 mb-2"><span className="text-2xl font-bold text-blue-600">{kpi.currentValue}{kpi.unit}</span><span className="text-sm text-gray-400">→ Target: {kpi.targetValue}{kpi.unit}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`rounded-full h-2 ${clampedProgress >= 80 ? "bg-green-500" : clampedProgress >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${clampedProgress}%` }} /></div><div className="flex justify-between text-xs mt-1"><span>{clampedProgress}%</span><span>{isInverse ? "Lower is better" : "Higher is better"}</span></div><div className="mt-2 flex gap-1">{[10,20,30,40,50,60,70,80,90,100].map(v => <button key={v} onClick={() => updateKPI(kpi.id, v)} className="text-xs px-1 py-0.5 border rounded hover:bg-blue-50">{v}</button>)}</div></div>; })}</div>}</div></div>;
}

export function CostTab({ costCategories }: DashboardTabProps) {
  const totalInitial = costCategories.reduce((s: number, c: any) => s + c.estimatedInitialCost, 0);
  const totalAnnual = costCategories.reduce((s: number, c: any) => s + c.estimatedAnnualCost, 0);
  return <div className="space-y-4"><div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-2"><i className="fas fa-calculator mr-2"></i>Cybersecurity Budget Planner</h3><p className="text-xs text-amber-600 mb-4"><i className="fas fa-info-circle mr-1"></i>These are illustrative estimates, not exact market prices. Actual costs vary based on vendor, organization size, and region.</p><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Category</th><th className="p-2">Est. Initial Cost (₹)</th><th className="p-2">Est. Annual Cost (₹)</th><th className="text-left p-2">Description</th></tr></thead><tbody>{costCategories.map((c: any, i: number) => <tr key={i} className="border-b hover:bg-gray-50"><td className="p-2 font-medium">{c.name}</td><td className="p-2 text-right">₹{c.estimatedInitialCost.toLocaleString()}</td><td className="p-2 text-right">₹{c.estimatedAnnualCost.toLocaleString()}</td><td className="p-2 text-gray-500 text-xs">{c.description}</td></tr>)}<tr className="font-bold bg-blue-50"><td className="p-2">Total</td><td className="p-2 text-right">₹{totalInitial.toLocaleString()}</td><td className="p-2 text-right">₹{totalAnnual.toLocaleString()}</td><td /></tr></tbody></table></div><div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"><h4 className="font-semibold text-green-800 text-sm mb-2"><i className="fas fa-chart-line mr-1"></i>Security Improvement per ₹ Spent</h4><p className="text-xs text-green-700">The most cost-effective controls (highest risk reduction per rupee) are: MFA, automatic updates, password managers, and security awareness training. Prioritize these for maximum impact with minimum investment.</p></div></div></div>;
}
