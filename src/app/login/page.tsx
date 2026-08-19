"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (data.user?.role === "sys_admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <i className="fas fa-shield-alt text-cyan-400 text-4xl mb-3"></i>
          <h1 className="text-3xl font-bold text-white">CyberShield NGO</h1>
          <p className="text-slate-400 mt-1">Cybersecurity Risk Assessment Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sign-in-alt mr-2"></i>}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-semibold">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setUsername("ngo_admin"); setPassword("Ngo@123"); }}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition"
              >
                <i className="fas fa-user mr-1"></i>NGO Admin
              </button>
              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("Admin@123"); }}
                className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 p-2 rounded-lg transition"
              >
                <i className="fas fa-user-shield mr-1"></i>Sys Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          <i className="fas fa-shield-alt mr-1"></i>
          Defensive cybersecurity project – EY GDS Training
        </p>
      </div>
    </div>
  );
}
