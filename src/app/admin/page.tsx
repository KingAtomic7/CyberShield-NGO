"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const authRes = await fetch("/api/auth"); const authData = await authRes.json();
      if (!authData.authenticated) { router.push("/login"); return; }
      if (authData.user?.role !== "sys_admin") { router.push("/dashboard"); return; }
      const res = await fetch("/api/data?action=admin-stats");
      const data = await res.json(); setStats(data);
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i></div>;

  const maturityLabels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];
  const riskColors: Record<string, string> = { critical: "text-red-600", high: "text-orange-600", medium: "text-yellow-600", low: "text-green-600" };
  const riskBg: Record<string, string> = { critical: "bg-red-100 text-red-800", high: "bg-orange-100 text-orange-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield Admin</span></div>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm"><i className="fas fa-sign-out-alt mr-1"></i>Logout</button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6"><i className="fas fa-user-shield mr-2 text-purple-600"></i>System Administrator Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Organizations</p><p className="text-2xl font-bold">{stats?.totalOrganizations || 0}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Avg Security Score</p><p className="text-2xl font-bold text-blue-600">{stats?.averageScore || 0}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Critical Risk Orgs</p><p className="text-2xl font-bold text-red-600">{stats?.criticalRiskOrgs || 0}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">High Risk Orgs</p><p className="text-2xl font-bold text-orange-600">{stats?.highRiskOrgs || 0}</p></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Total Assessments</p><p className="text-2xl font-bold">{stats?.totalAssessments || 0}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Completed Assessments</p><p className="text-2xl font-bold text-green-600">{stats?.completedAssessments || 0}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Average Maturity</p><p className="text-2xl font-bold text-indigo-600">{stats?.averageMaturity || 0}</p></div>
        </div>

        {stats?.topCategories?.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <h3 className="font-semibold mb-3">Most Common Recommendation Categories</h3>
            <div className="space-y-2">
              {stats.topCategories.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-44 text-sm text-gray-700">{c.name}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4"><div className="bg-blue-500 rounded-full h-4" style={{ width: `${(c.count / stats.topCategories[0].count) * 100}%` }}></div></div>
                  <span className="text-sm font-medium">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold mb-3">Registered Organizations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Organization</th><th className="p-2">Type</th><th className="p-2">Score</th><th className="p-2">Risk Level</th><th className="p-2">Maturity</th></tr></thead>
              <tbody>
                {(stats?.organizations || []).map((o: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{o.name}</td>
                    <td className="p-2 text-gray-500 text-xs">{o.type || "—"}</td>
                    <td className="p-2 text-center font-bold">{o.score ?? "—"}</td>
                    <td className="p-2 text-center">{o.riskLevel ? <span className={`px-2 py-0.5 rounded text-xs font-bold ${riskBg[o.riskLevel] || riskBg.medium}`}>{o.riskLevel.toUpperCase()}</span> : "—"}</td>
                    <td className="p-2 text-center">{o.maturityLevel ? `Level ${o.maturityLevel}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
