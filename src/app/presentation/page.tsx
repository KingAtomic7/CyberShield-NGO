"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PresentationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [assessment, setAssessment] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const authRes = await fetch("/api/auth"); const authData = await authRes.json();
      if (authData.authenticated && authData.user?.organizationId) {
        const [orgRes, assessRes] = await Promise.all([
          fetch(`/api/organization?id=${authData.user.organizationId}`),
          fetch("/api/assessment?action=results"),
        ]);
        const orgD = await orgRes.json(); setOrg(orgD.organization);
        const assessD = await assessRes.json(); setAssessment(assessD.assessment);
      }
    })();
  }, [router]);

  const maturityLabels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];
  const score = assessment?.overallScore || 0;
  const riskLevel = assessment?.riskLevel || "medium";
  const maturityLevel = assessment?.maturityLevel || 1;

  const steps = [
    {
      title: "The Problem",
      subtitle: "Why Cybersecurity Matters for NGOs",
      icon: "fa-exclamation-triangle",
      color: "from-red-900 to-red-700",
      content: (
        <div className="space-y-4">
          <p>NGOs handle sensitive data — donor records, beneficiary information, financial data — making them attractive targets for cyber attacks.</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg"><p className="text-2xl font-bold">60%</p><p className="text-sm">of small orgs close within 6 months of a breach</p></div>
            <div className="bg-white/10 p-4 rounded-lg"><p className="text-2xl font-bold">43%</p><p className="text-sm">of cyber attacks target small organizations</p></div>
            <div className="bg-white/10 p-4 rounded-lg"><p className="text-2xl font-bold">₹4.5Cr</p><p className="text-sm">average cost of a data breach in India</p></div>
          </div>
          <p className="text-lg font-medium">Most NGOs lack dedicated IT security staff, formal policies, and basic security controls.</p>
        </div>
      ),
    },
    {
      title: "Risk Assessment",
      subtitle: "10-Category Cybersecurity Assessment",
      icon: "fa-clipboard-check",
      color: "from-blue-900 to-blue-700",
      content: (
        <div className="space-y-4">
          <p>Comprehensive assessment across 10 cybersecurity domains with 50+ practical questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {["Identity & Access Management", "Endpoint Security", "Network Security", "Data Protection", "Backup & Disaster Recovery", "Email Security", "Employee Security Awareness", "Incident Response", "Security Policies", "Vulnerability Management"].map((c, i) => (
              <div key={i} className="bg-white/10 p-2 rounded flex items-center gap-2"><span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span><span className="text-sm">{c}</span></div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Security Score",
      subtitle: `Overall Score: ${score}/100 | Risk: ${riskLevel.toUpperCase()} | Maturity: Level ${maturityLevel}`,
      icon: "fa-chart-line",
      color: score >= 60 ? "from-green-900 to-green-700" : score >= 40 ? "from-yellow-900 to-yellow-700" : "from-red-900 to-red-700",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 80}`} strokeDashoffset={`${2 * Math.PI * 80 - (score / 100) * 2 * Math.PI * 80}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl font-bold">{score}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 p-3 rounded-lg"><p className="text-sm">Risk Level</p><p className="text-xl font-bold uppercase">{riskLevel}</p></div>
            <div className="bg-white/10 p-3 rounded-lg"><p className="text-sm">Maturity</p><p className="text-xl font-bold">Level {maturityLevel}</p><p className="text-xs">{maturityLabels[maturityLevel]}</p></div>
            <div className="bg-white/10 p-3 rounded-lg"><p className="text-sm">Target</p><p className="text-xl font-bold">Level {Math.min(maturityLevel + 1, 5)}</p><p className="text-xs">{maturityLabels[Math.min(maturityLevel + 1, 5)]}</p></div>
          </div>
        </div>
      ),
    },
    {
      title: "Gap Analysis",
      subtitle: "Identifying Critical Security Gaps",
      icon: "fa-search",
      color: "from-orange-900 to-orange-700",
      content: (
        <div className="space-y-4">
          <p>Systematic comparison of current vs. expected security posture across all categories.</p>
          <div className="space-y-3">
            {[
              { area: "MFA for Critical Accounts", current: "Partially Implemented (45%)", gap: "55% of accounts unprotected", risk: "Critical" },
              { area: "Employee Security Training", current: "Not Implemented", gap: "No training program exists", risk: "High" },
              { area: "Backup & Recovery", current: "Partially Implemented", gap: "No off-site backup, not tested", risk: "Critical" },
              { area: "Incident Response Plan", current: "Not Implemented", gap: "No documented IR plan", risk: "High" },
              { area: "Data Encryption", current: "Partially Implemented", gap: "Sensitive data not fully encrypted", risk: "High" },
            ].map((g, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-lg">
                <div className="flex justify-between"><span className="font-medium">{g.area}</span><span className={`text-xs font-bold ${g.risk === "Critical" ? "text-red-300" : "text-orange-300"}`}>{g.risk}</span></div>
                <p className="text-sm opacity-80">Current: {g.current} | Gap: {g.gap}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Prioritized Recommendations",
      subtitle: "Intelligence Rule-Based Recommendation Engine",
      icon: "fa-lightbulb",
      color: "from-purple-900 to-purple-700",
      content: (
        <div className="space-y-4">
          <p>Priority = Risk × Business Impact / Implementation Effort</p>
          <div className="space-y-2">
            {[
              { rec: "Enable MFA for all critical accounts", priority: "Immediate", cost: "₹0-500/mo" },
              { rec: "Install endpoint protection on all devices", priority: "Immediate", cost: "₹0-2000/yr" },
              { rec: "Implement automated encrypted backups", priority: "Immediate", cost: "₹500-5000/mo" },
              { rec: "Change all default passwords", priority: "Immediate", cost: "₹0" },
              { rec: "Security awareness training for all staff", priority: "Immediate", cost: "₹0-2000/mo" },
              { rec: "Create incident response plan", priority: "Short Term", cost: "Staff time" },
              { rec: "Implement data classification", priority: "Short Term", cost: "Staff time" },
              { rec: "Configure email authentication (SPF/DKIM/DMARC)", priority: "Medium Term", cost: "₹0" },
            ].map((r, i) => (
              <div key={i} className="bg-white/10 p-2 rounded flex items-center justify-between">
                <span className="text-sm">{r.rec}</span>
                <div className="flex gap-2"><span className="text-xs bg-white/20 px-2 py-0.5 rounded">{r.priority}</span><span className="text-xs bg-white/20 px-2 py-0.5 rounded">{r.cost}</span></div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Implementation Roadmap",
      subtitle: "Phased 12-Month Security Improvement Plan",
      icon: "fa-road",
      color: "from-teal-900 to-teal-700",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { phase: "First 30 Days", items: ["Enable MFA", "Update passwords", "Auto updates", "Verify backups", "Install AV", "Basic training"], color: "bg-red-500/30" },
            { phase: "30-90 Days", items: ["Security policies", "Data classification", "Access reviews", "Email security", "IR plan", "Encryption"], color: "bg-orange-500/30" },
            { phase: "3-6 Months", items: ["Vuln scanning", "Logging/monitoring", "Phishing sims", "Security audit", "BCP plan", "VPN setup"], color: "bg-yellow-500/30" },
            { phase: "6-12 Months", items: ["EDR evaluation", "External assessment", "Pen testing", "Automation", "Continuous improvement"], color: "bg-green-500/30" },
          ].map((p, i) => (
            <div key={i} className={`${p.color} p-4 rounded-lg`}>
              <h4 className="font-bold mb-2">{p.phase}</h4>
              <ul className="space-y-1">{p.items.map((item, j) => <li key={j} className="text-sm flex items-center gap-1"><i className="fas fa-check text-xs"></i>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Continuous Improvement",
      subtitle: "Security is a Journey, Not a Destination",
      icon: "fa-sync-alt",
      color: "from-indigo-900 to-indigo-700",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {["Assess", "Plan", "Implement", "Monitor", "Improve"].map((s, i) => (
              <div key={i} className="flex items-center gap-2"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">{i + 1}</div><span className="font-medium">{s}</span>{i < 4 && <i className="fas fa-arrow-right opacity-50"></i>}</div>
            ))}
          </div>
          <p className="text-center text-lg">Cybersecurity improvement is an ongoing process. Regular reassessment, monitoring, and adaptation ensure your organization stays protected as threats evolve.</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-lg"><i className="fas fa-calendar-check text-2xl mb-2"></i><p className="text-sm">Quarterly Reviews</p></div>
            <div className="bg-white/10 p-4 rounded-lg"><i className="fas fa-chart-line text-2xl mb-2"></i><p className="text-sm">KPI Tracking</p></div>
            <div className="bg-white/10 p-4 rounded-lg"><i className="fas fa-redo text-2xl mb-2"></i><p className="text-sm">Annual Reassessment</p></div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStep.color} text-white flex flex-col`}>
      <div className="px-6 py-3 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield NGO – Presentation Mode</span></div>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-70">{step + 1}/{steps.length}</span>
          <a href="/dashboard" className="text-sm opacity-70 hover:opacity-100"><i className="fas fa-times mr-1"></i>Exit</a>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <i className={`fas ${currentStep.icon} text-5xl mb-4 opacity-80`}></i>
            <h1 className="text-4xl font-bold mb-2">{currentStep.title}</h1>
            <p className="text-xl opacity-80">{currentStep.subtitle}</p>
          </div>
          <div className="text-lg leading-relaxed">{currentStep.content}</div>
        </div>
      </div>

      <div className="px-6 py-4 bg-black/20 flex items-center justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition">
          <i className="fas fa-arrow-left mr-2"></i>Previous
        </button>
        <div className="flex gap-2">
          {steps.map((_, i) => <button key={i} onClick={() => setStep(i)} className={`w-3 h-3 rounded-full transition ${i === step ? "bg-white" : "bg-white/30"}`} />)}
        </div>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition">
          Next<i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
}
