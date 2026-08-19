export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-shield-alt text-cyan-400 text-2xl"></i>
            <span className="text-xl font-bold">CyberShield NGO</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/login" className="text-slate-300 hover:text-white transition">Login</a>
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-shield-alt text-cyan-400"></i>
              <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">EY GDS Training Project</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              CyberShield NGO
            </h1>
            <p className="text-2xl text-blue-200 mb-6 leading-relaxed">
              Practical Cybersecurity for Resource-Constrained Non-Profit Organizations
            </p>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              A comprehensive cybersecurity risk assessment and improvement platform designed
              specifically for NGOs with limited budgets and IT resources. Assess your security
              posture, identify gaps, and get a prioritized improvement roadmap.
            </p>
            <div className="flex gap-4">
              <a href="/login" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg">
                <i className="fas fa-clipboard-check mr-2"></i>
                Start Cybersecurity Assessment
              </a>
              <a href="/presentation" className="border border-slate-400 hover:border-white text-slate-300 hover:text-white px-6 py-3 rounded-lg text-lg transition">
                <i className="fas fa-play-circle mr-2"></i>
                Presentation Mode
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cybersecurity Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Cybersecurity Matters for NGOs</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            NGOs handle sensitive donor data, beneficiary information, and financial records—making them
            attractive targets for cyber attacks. Yet most lack the resources for dedicated security teams.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 hover-lift">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Rising Threats</h3>
              <p className="text-red-700">NGOs are increasingly targeted by phishing, ransomware, and data breaches. 60% of small organizations go out of business within 6 months of a cyber attack.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 hover-lift">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-database text-amber-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Sensitive Data</h3>
              <p className="text-amber-700">NGOs store donor records, beneficiary data, and financial information. A breach can destroy trust and violate data protection regulations.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover-lift">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-coins text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Limited Resources</h3>
              <p className="text-blue-700">Most NGOs have minimal IT budgets and staff. Practical, cost-effective security measures can dramatically reduce risk without breaking the budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "fa-clipboard-check", color: "blue", title: "Risk Assessment", desc: "Comprehensive 10-category cybersecurity assessment with 50+ practical questions tailored for NGO operations." },
              { icon: "fa-chart-line", color: "cyan", title: "Security Scoring", desc: "Transparent 0-100 security score with risk levels (Low to Critical) and 5-level maturity model." },
              { icon: "fa-search", color: "purple", title: "Gap Analysis", desc: "Identify gaps between current and expected security posture with prioritized remediation actions." },
              { icon: "fa-lightbulb", color: "amber", title: "Recommendations", desc: "Intelligent rule-based recommendation engine generating 25+ prioritized, actionable security improvements." },
              { icon: "fa-road", color: "green", title: "Implementation Roadmap", desc: "Phased 12-month roadmap from immediate quick wins to long-term strategic improvements." },
              { icon: "fa-tachometer-alt", color: "indigo", title: "Dashboard & KPIs", desc: "Visual dashboards with Chart.js charts, progress tracking, and security KPI monitoring." },
              { icon: "fa-calculator", color: "teal", title: "Cost Estimation", desc: "Budget planner with illustrative cost estimates for security improvements, emphasizing cost-effective controls." },
              { icon: "fa-fire-extinguisher", color: "red", title: "Incident Response", desc: "Incident recording and tracking with full lifecycle management from identification to improvement." },
              { icon: "fa-file-alt", color: "orange", title: "Policy Library", desc: "Downloadable security policy templates covering passwords, MFA, data protection, and more." },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover-lift border border-gray-100">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`fas ${feature.icon} text-${feature.color}-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Assessment Categories</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              "Identity & Access Management",
              "Endpoint Security",
              "Network Security",
              "Data Protection",
              "Backup & Disaster Recovery",
              "Email Security",
              "Employee Security Awareness",
              "Incident Response",
              "Security Policies",
              "Vulnerability Management",
            ].map((cat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="font-medium text-slate-700">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity Model */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cybersecurity Maturity Model</h2>
          <div className="space-y-4">
            {[
              { level: 5, label: "Optimized", range: "80-100", color: "bg-green-500", desc: "Mature, optimized security program with automation and metrics" },
              { level: 4, label: "Advanced", range: "60-79", color: "bg-blue-500", desc: "Proactive security with regular testing and monitoring" },
              { level: 3, label: "Managed", range: "40-59", color: "bg-cyan-500", desc: "Formal policies and procedures with consistent controls" },
              { level: 2, label: "Basic", range: "20-39", color: "bg-amber-500", desc: "Some basic controls but inconsistent implementation" },
              { level: 1, label: "Initial", range: "0-19", color: "bg-red-500", desc: "No formal practices; ad-hoc and reactive approach" },
            ].map((m) => (
              <div key={m.level} className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur">
                <div className={`w-12 h-12 ${m.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {m.level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Level {m.level} – {m.label}</span>
                    <span className="text-sm text-slate-300">(Score {m.range})</span>
                  </div>
                  <p className="text-sm text-slate-300">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Demo Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3"><i className="fas fa-user-tie mr-2"></i>NGO Administrator</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Username:</span> <code className="bg-gray-100 px-2 py-1 rounded">ngo_admin</code></p>
                <p><span className="text-gray-500">Password:</span> <code className="bg-gray-100 px-2 py-1 rounded">Ngo@123</code></p>
              </div>
              <p className="text-xs text-gray-500 mt-3">Organization: Helping Hands Foundation</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3"><i className="fas fa-user-shield mr-2"></i>System Administrator</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Username:</span> <code className="bg-gray-100 px-2 py-1 rounded">admin</code></p>
                <p><span className="text-gray-500">Password:</span> <code className="bg-gray-100 px-2 py-1 rounded">Admin@123</code></p>
              </div>
              <p className="text-xs text-gray-500 mt-3">Access: All organizations and admin dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <i className="fas fa-shield-alt text-cyan-400"></i>
            <span className="text-white font-bold">CyberShield NGO</span>
          </div>
          <p className="text-sm mb-2">EY GDS Training Project – Cybersecurity Risk Assessment & Improvement Platform</p>
          <p className="text-xs text-slate-500">
            This is a defensive cybersecurity project only. No offensive attack functionality included.
            <br />Project developed for educational and demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
