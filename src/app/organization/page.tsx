"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationPage() {
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const authRes = await fetch("/api/auth"); const authData = await authRes.json();
        if (!authData.authenticated) { router.push("/login"); return; }
        setUser(authData.user);
        if (authData.user?.organizationId) {
          const res = await fetch(`/api/organization?id=${authData.user.organizationId}`);
          const data = await res.json();
          if (data.organization) { setOrg(data.organization); setForm(data.organization); }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/organization", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: org.id, ...form }) });
      const data = await res.json();
      if (data.organization) { setOrg(data.organization); setEditing(false); }
    } catch { alert("Save failed"); } finally { setSaving(false); }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/organization", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.organization) { setOrg(data.organization); setEditing(false); }
    } catch { alert("Create failed"); } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i></div>;

  const boolFields = ["usesCloudServices", "usesOnlineBanking", "storesDonorData", "storesBeneficiaryData", "storesEmployeeData", "usesThirdPartyVendors"];
  const boolLabels: Record<string, string> = { usesCloudServices: "Uses Cloud Services", usesOnlineBanking: "Uses Online Banking", storesDonorData: "Stores Donor Data", storesBeneficiaryData: "Stores Beneficiary Data", storesEmployeeData: "Stores Employee Data", usesThirdPartyVendors: "Uses Third-Party Vendors" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield NGO</span></div>
        <a href="/dashboard" className="text-slate-300 hover:text-white text-sm"><i className="fas fa-arrow-left mr-1"></i>Dashboard</a>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6"><i className="fas fa-building mr-2 text-blue-600"></i>Organization Profile</h1>

        {org && !editing ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between mb-4"><h2 className="text-lg font-semibold">{org.name}</h2><button onClick={() => setEditing(true)} className="text-blue-600 hover:text-blue-700 text-sm"><i className="fas fa-edit mr-1"></i>Edit</button></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-500">Type</span><p className="font-medium">{org.type || "—"}</p></div>
              <div><span className="text-xs text-gray-500">Employees</span><p className="font-medium">{org.numEmployees}</p></div>
              <div><span className="text-xs text-gray-500">Volunteers</span><p className="font-medium">{org.numVolunteers}</p></div>
              <div><span className="text-xs text-gray-500">Locations</span><p className="font-medium">{org.numLocations}</p></div>
              <div><span className="text-xs text-gray-500">Annual IT Budget</span><p className="font-medium">₹{org.annualItBudget?.toLocaleString()}</p></div>
              <div><span className="text-xs text-gray-500">IT Staff</span><p className="font-medium">{org.itStaffCount}</p></div>
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-2">
              {boolFields.map(f => (
                <div key={f} className={`p-2 rounded-lg text-sm ${org[f] ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <i className={`fas ${org[f] ? "fa-check-circle" : "fa-times-circle"} mr-1`}></i>{boolLabels[f]}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">{org ? "Edit Organization" : "Create Organization"}</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><input type="text" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type || ""} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-lg p-2 text-sm"><option value="">Select...</option><option>Non-Governmental Organization (NGO)</option><option>Charitable Trust</option><option>Society</option><option>Section 8 Company</option><option>Other</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label><input type="number" value={form.numEmployees || ""} onChange={e => setForm({...form, numEmployees: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Volunteers</label><input type="number" value={form.numVolunteers || ""} onChange={e => setForm({...form, numVolunteers: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Locations</label><input type="number" value={form.numLocations || ""} onChange={e => setForm({...form, numLocations: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Annual IT Budget (₹)</label><input type="number" value={form.annualItBudget || ""} onChange={e => setForm({...form, annualItBudget: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">IT Staff Count</label><input type="number" value={form.itStaffCount || ""} onChange={e => setForm({...form, itStaffCount: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Data & Services Profile</h3>
                <div className="grid md:grid-cols-3 gap-2">
                  {boolFields.map(f => (
                    <label key={f} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer text-sm">
                      <input type="checkbox" checked={!!form[f]} onChange={e => setForm({...form, [f]: e.target.checked})} className="rounded" />{boolLabels[f]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={org ? handleSave : handleCreate} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                  {saving ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-save mr-1"></i>}{saving ? "Saving..." : "Save"}
                </button>
                {org && <button onClick={() => { setEditing(false); setForm(org); }} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
