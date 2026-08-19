"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const incidentTypes = ["phishing", "malware", "ransomware", "account_compromise", "data_leakage", "lost_device", "unauthorized_access", "other"];
const incidentStatuses = ["identified", "containing", "eradicating", "recovering", "reviewing", "improved"];
const severityLevels = ["low", "medium", "high", "critical"];

export default function IncidentsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [orgId, setOrgId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "phishing", incidentDate: new Date().toISOString().split("T")[0], severity: "medium", description: "", affectedSystem: "", status: "identified", responseActions: "", lessonsLearned: "" });

  useEffect(() => {
    (async () => {
      const authRes = await fetch("/api/auth"); const authData = await authRes.json();
      if (!authData.authenticated) { router.push("/login"); return; }
      if (authData.user?.organizationId) {
        setOrgId(authData.user.organizationId);
        const res = await fetch(`/api/data?action=incidents&orgId=${authData.user.organizationId}`);
        const data = await res.json(); setIncidents(data.incidents || []);
      }
    })();
  }, [router]);

  const handleCreate = async () => {
    const res = await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create-incident", orgId, ...form }) });
    const data = await res.json();
    if (data.incident) { setIncidents(prev => [data.incident, ...prev]); setShowForm(false); setForm({ type: "phishing", incidentDate: new Date().toISOString().split("T")[0], severity: "medium", description: "", affectedSystem: "", status: "identified", responseActions: "", lessonsLearned: "" }); }
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-incident", itemId: id, [field]: value }) });
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, [field]: value } : inc));
  };

  const sevColors: Record<string, string> = { critical: "bg-red-100 text-red-800", high: "bg-orange-100 text-orange-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield NGO</span></div>
        <a href="/dashboard" className="text-slate-300 hover:text-white text-sm"><i className="fas fa-arrow-left mr-1"></i>Dashboard</a>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold"><i className="fas fa-fire-extinguisher mr-2 text-red-600"></i>Incident Response</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"><i className="fas fa-plus mr-1"></i>Report Incident</button>
        </div>

        {/* Lifecycle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-3">Incident Response Lifecycle</h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {["Identify", "Contain", "Eradicate", "Recover", "Review", "Improve"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <span className="text-sm font-medium">{step}</span>
                {i < 5 && <i className="fas fa-arrow-right text-gray-400"></i>}
              </div>
            ))}
          </div>
        </div>

        {/* New Incident Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <h3 className="font-semibold mb-4">Report New Incident</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Incident Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-lg p-2 text-sm">{incidentTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={form.incidentDate} onChange={e => setForm({...form, incidentDate: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Severity</label><select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className="w-full border rounded-lg p-2 text-sm">{severityLevels.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Affected System</label><input type="text" value={form.affectedSystem} onChange={e => setForm({...form, affectedSystem: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg p-2 text-sm" rows={3} /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Response Actions</label><textarea value={form.responseActions} onChange={e => setForm({...form, responseActions: e.target.value})} className="w-full border rounded-lg p-2 text-sm" rows={2} /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"><i className="fas fa-save mr-1"></i>Save</button>
              <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.length === 0 ? <p className="text-center text-gray-500 py-8">No incidents recorded.</p> :
            incidents.map((inc: any) => (
              <div key={inc.id} className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderLeftColor: inc.severity === "critical" ? "#dc2626" : inc.severity === "high" ? "#ea580c" : inc.severity === "medium" ? "#ca8a04" : "#16a34a", borderLeftWidth: "4px" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{(inc.type || "").replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())} Incident</h4>
                    <p className="text-xs text-gray-500">{inc.incidentDate} • {inc.affectedSystem || "N/A"}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${sevColors[inc.severity] || sevColors.medium}`}>{(inc.severity || "medium").toUpperCase()}</span>
                    <select value={inc.status} onChange={e => handleUpdate(inc.id, "status", e.target.value)} className="text-xs border rounded px-2 py-1">
                      {incidentStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{inc.description}</p>
                {inc.responseActions && <p className="text-sm text-blue-700"><i className="fas fa-tools mr-1"></i>{inc.responseActions}</p>}
                {inc.lessonsLearned && <p className="text-sm text-green-700 mt-1"><i className="fas fa-lightbulb mr-1"></i>{inc.lessonsLearned}</p>}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
