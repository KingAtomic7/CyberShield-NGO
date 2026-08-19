"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chart } from "chart.js/auto";
import { OverviewTab, RisksTab, GapTab, RecsTab, RoadmapTab, KpiTab, CostTab, maturityLabels, type DashboardTabProps } from "./tabs";

type RiskLevel = "critical" | "high" | "medium" | "low";
type Tab = "overview" | "risks" | "gap" | "recommendations" | "roadmap" | "kpi" | "cost";

type SidebarProps = {
  org: { name?: string } | null;
  tabs: { key: Tab; icon: string; label: string }[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
};

function DashboardSidebar({ org, tabs, activeTab, onTabChange, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col flex-shrink-0 no-print">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <i className="fas fa-shield-alt text-cyan-400"></i>
          <span className="font-bold">CyberShield NGO</span>
        </div>
      </div>
      <div className="p-3 border-b border-slate-700">
        <p className="text-xs text-slate-400">Organization</p>
        <p className="text-sm font-medium truncate">{org?.name || "Not set"}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${activeTab === t.key ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
            <i className={`fas ${t.icon} w-4`}></i>{t.label}
          </button>
        ))}
        <hr className="border-slate-700 my-2" />
        <a href="/assessment" className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 block">
          <i className="fas fa-clipboard-check w-4"></i>Assessment
        </a>
        <a href="/organization" className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 block">
          <i className="fas fa-building w-4"></i>Organization
        </a>
        <a href="/incidents" className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 block">
          <i className="fas fa-fire-extinguisher w-4"></i>Incidents
        </a>
        <a href="/policies" className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 block">
          <i className="fas fa-file-alt w-4"></i>Policies
        </a>
      </nav>
      <div className="p-3 border-t border-slate-700">
        <a href="/presentation" className="w-full text-left px-3 py-2 rounded-lg text-sm text-cyan-400 hover:bg-slate-800 transition flex items-center gap-2 block mb-1">
          <i className="fas fa-play-circle w-4"></i>Presentation Mode
        </a>
        <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800 transition flex items-center gap-2">
          <i className="fas fa-sign-out-alt w-4"></i>Logout
        </button>
      </div>
    </div>
  );
}

function computeRiskDistribution(answers: { riskLevel?: string }[]) {
  return answers.reduce(
    (acc, answer) => {
      const level = answer.riskLevel as keyof typeof acc;
      if (level in acc) acc[level]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id:string;username:string;role:string;organizationId?:string}|null>(null);
  const [org, setOrg] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [riskResults, setRiskResults] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [costCategories, setCostCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const authRes = await fetch("/api/auth");
        const authData = await authRes.json();
        if (cancelled) return;
        if (!authData.authenticated) {
          router.push("/login");
          return;
        }
        setUser(authData.user);

        if (authData.user.organizationId) {
          const orgId = authData.user.organizationId;
          const [orgRes, assessRes, recRes, roadmapRes, kpiRes, gapRes, costRes] = await Promise.all([
            fetch(`/api/organization?id=${orgId}`),
            fetch("/api/assessment?action=results"),
            fetch(`/api/data?action=recommendations&orgId=${orgId}`),
            fetch(`/api/data?action=roadmap&orgId=${orgId}`),
            fetch(`/api/data?action=kpis&orgId=${orgId}`),
            fetch(`/api/data?action=gap-analysis&orgId=${orgId}`),
            fetch("/api/data?action=cost"),
          ]);

          if (cancelled) return;

          const orgD = await orgRes.json();
          const assessD = await assessRes.json();
          const recD = await recRes.json();
          const roadD = await roadmapRes.json();
          const kpiD = await kpiRes.json();
          const gapD = await gapRes.json();
          const costD = await costRes.json();

          setOrg(orgD.organization);
          setAssessment(assessD.assessment);
          setAnswers(assessD.answers || []);
          setRiskResults(assessD.riskResults || []);
          setRecs(recD.recommendations || []);
          setRoadmapItems(roadD.items || []);
          setKpiData(kpiD.kpis || []);
          setGaps(gapD.gaps || []);
          setCostCategories(costD.categories || []);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDashboard();
    return () => { cancelled = true; };
  }, [router]);

  const score = assessment?.overallScore || 0;
  const riskLevel = (assessment?.riskLevel || "medium") as RiskLevel;
  const maturityLevel = assessment?.maturityLevel || 1;
  const dist = computeRiskDistribution(answers);
  const roadmapProgress = roadmapItems.length > 0
    ? Math.round((roadmapItems.filter((r: { status: string }) => r.status === "completed").length / roadmapItems.length) * 100)
    : 0;

  // Chart.js is imported as a module, so there is no CDN/script-load race.
  useEffect(() => {
    if (loading || !assessment || activeTab !== "overview") return;

    const charts = [
      { id: "radarChart", type: "radar" as const, data: { labels: riskResults.map((r: { category: string }) => r.category), datasets: [{ label: "Category Score", data: riskResults.map((r: { categoryScore?: number }) => r.categoryScore || 0), backgroundColor: "rgba(59,130,246,0.2)", borderColor: "rgb(59,130,246)", pointBackgroundColor: "rgb(59,130,246)" }] }, options: { scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } }, plugins: { legend: { display: false } } } },
      { id: "doughnutChart", type: "doughnut" as const, data: { labels: ["Critical", "High", "Medium", "Low"], datasets: [{ data: [dist.critical, dist.high, dist.medium, dist.low], backgroundColor: ["#dc2626", "#ea580c", "#ca8a04", "#16a34a"] }] }, options: { plugins: { legend: { position: "bottom" as const } } } },
      { id: "maturityChart", type: "bar" as const, data: { labels: ["Current", "Target"], datasets: [{ data: [maturityLevel, Math.min(maturityLevel + 1, 5)], backgroundColor: ["#3b82f6", "#06b6d4"], borderRadius: 8 }] }, options: { scales: { y: { min: 0, max: 5, ticks: { stepSize: 1, callback: (v: number | string) => maturityLabels[Number(v)] || "" } } }, plugins: { legend: { display: false } } } },
    ];

    const instances: Chart[] = [];
    for (const config of charts) {
      const canvas = document.getElementById(config.id) as HTMLCanvasElement | null;
      if (!canvas) continue;
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
      instances.push(new Chart(canvas, config as any));
    }

    const roadmapCanvas = document.getElementById("roadmapChart") as HTMLCanvasElement | null;
    if (roadmapCanvas && roadmapItems.length > 0) {
      const existing = Chart.getChart(roadmapCanvas);
      if (existing) existing.destroy();
      const phaseKeys = ["first_30_days", "30_to_90_days", "3_to_6_months", "6_to_12_months"];
      const completed = phaseKeys.map(pk => roadmapItems.filter((r: any) => r.phase === pk && r.status === "completed").length);
      const total = phaseKeys.map(pk => roadmapItems.filter((r: any) => r.phase === pk).length);
      instances.push(new Chart(roadmapCanvas, {
        type: "bar",
        data: { labels: ["First 30 Days", "30-90 Days", "3-6 Months", "6-12 Months"], datasets: [{ label: "Completed", data: completed, backgroundColor: "#16a34a", borderRadius: 4 }, { label: "Remaining", data: total.map((t, i) => t - completed[i]), backgroundColor: "#e2e8f0", borderRadius: 4 }] },
        options: { scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } },
      }));
    }

    return () => instances.forEach(chart => chart.destroy());
  }, [loading, assessment, activeTab, riskResults, roadmapItems, dist, maturityLevel]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    router.push("/login");
  };

  const updateRoadmap = async (itemId: string, status: string) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-roadmap", itemId, status }) });
    setRoadmapItems(prev => prev.map((item: any) => item.id === itemId ? { ...item, status } : item));
  };

  const updateRecStatus = async (itemId: string, status: string) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-recommendation", itemId, status }) });
    setRecs(prev => prev.map((r: any) => r.id === itemId ? { ...r, status } : r));
  };

  const updateKPI = async (kpiId: string, currentValue: number) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-kpi", kpiId, currentValue }) });
    setKpiData(prev => prev.map((k: any) => k.id === kpiId ? { ...k, currentValue } : k));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><i className="fas fa-spinner fa-spin text-cyan-400 text-4xl"></i></div>;

  const tabProps: DashboardTabProps = { score, riskLevel, maturityLevel, dist, roadmapProgress, assessment, answers, riskResults, recs, roadmapItems, kpiData, gaps, costCategories, updateRoadmap, updateRecStatus, updateKPI };

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: "overview", icon: "fa-tachometer-alt", label: "Overview" },
    { key: "risks", icon: "fa-exclamation-triangle", label: "Risks" },
    { key: "gap", icon: "fa-search", label: "Gap Analysis" },
    { key: "recommendations", icon: "fa-lightbulb", label: "Recommendations" },
    { key: "roadmap", icon: "fa-road", label: "Roadmap" },
    { key: "kpi", icon: "fa-chart-bar", label: "KPIs" },
    { key: "cost", icon: "fa-calculator", label: "Cost" },
  ];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        org={org}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between no-print">
          <h1 className="text-lg font-semibold text-gray-800"><i className={`fas ${tabs.find(t => t.key === activeTab)?.icon} mr-2 text-blue-600`}></i>{tabs.find(t => t.key === activeTab)?.label}</h1>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-gray-500"><i className="fas fa-user mr-1"></i>{user.username}</span>}
            <a href="/api/report" className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg"><i className="fas fa-file-pdf mr-1"></i>Report</a>
            <a href="/assessment" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg"><i className="fas fa-clipboard-check mr-1"></i>New Assessment</a>
          </div>
        </header>
        <main className="p-6">
          {!assessment ? (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-check text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No Assessment Yet</h2>
              <p className="text-gray-500 mb-6">Complete your first cybersecurity assessment to see your security posture.</p>
              <a href="/assessment" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"><i className="fas fa-play mr-2"></i>Start Assessment</a>
            </div>
          ) : (
            <>
              {activeTab === "overview" && <OverviewTab {...tabProps} />}
              {activeTab === "risks" && <RisksTab {...tabProps} />}
              {activeTab === "gap" && <GapTab {...tabProps} />}
              {activeTab === "recommendations" && <RecsTab {...tabProps} />}
              {activeTab === "roadmap" && <RoadmapTab {...tabProps} />}
              {activeTab === "kpi" && <KpiTab {...tabProps} />}
              {activeTab === "cost" && <CostTab {...tabProps} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
