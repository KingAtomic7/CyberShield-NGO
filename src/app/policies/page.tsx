"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PoliciesPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const authRes = await fetch("/api/auth"); const authData = await authRes.json();
      if (!authData.authenticated) { router.push("/login"); return; }
      if (authData.user?.organizationId) {
        const res = await fetch(`/api/data?action=policies&orgId=${authData.user.organizationId}`);
        const data = await res.json(); setPolicies(data.policies || []);
      }
    })();
  }, [router]);

  const handleDownload = (policy: any) => {
    const blob = new Blob([policy.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${policy.title.replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield NGO</span></div>
        <a href="/dashboard" className="text-slate-300 hover:text-white text-sm"><i className="fas fa-arrow-left mr-1"></i>Dashboard</a>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6"><i className="fas fa-file-alt mr-2 text-blue-600"></i>Security Policy Library</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            {policies.map((p: any, i: number) => (
              <button key={i} onClick={() => setSelectedPolicy(p)}
                className={`w-full text-left p-4 rounded-xl border transition ${selectedPolicy?.id === p.id ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                <h3 className="font-medium text-sm">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                <span className="text-xs text-blue-600 mt-1 inline-block">{p.category}</span>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            {selectedPolicy ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{selectedPolicy.title}</h2>
                  <button onClick={() => handleDownload(selectedPolicy)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs"><i className="fas fa-download mr-1"></i>Download</button>
                </div>
                <p className="text-sm text-gray-500 mb-4">{selectedPolicy.description}</p>
                <pre className="bg-gray-50 rounded-lg p-4 text-xs text-gray-700 whitespace-pre-wrap font-sans overflow-auto max-h-96">{selectedPolicy.content}</pre>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
                <i className="fas fa-file-alt text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">Select a policy to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
