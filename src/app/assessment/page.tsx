"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const answerOptions = [
  { value: "fully_implemented", label: "Fully Implemented", color: "bg-green-100 border-green-500 text-green-800", icon: "fa-check-circle" },
  { value: "partially_implemented", label: "Partially Implemented", color: "bg-yellow-100 border-yellow-500 text-yellow-800", icon: "fa-exclamation-circle" },
  { value: "not_implemented", label: "Not Implemented", color: "bg-red-100 border-red-500 text-red-800", icon: "fa-times-circle" },
  { value: "not_applicable", label: "Not Applicable", color: "bg-gray-100 border-gray-400 text-gray-600", icon: "fa-ban" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [orgId, setOrgId] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const authRes = await fetch("/api/auth");
        const authData = await authRes.json();
        if (!authData.authenticated) { router.push("/login"); return; }
        if (authData.user?.organizationId) setOrgId(authData.user.organizationId);

        const qRes = await fetch("/api/assessment?action=questions");
        const qData = await qRes.json();
        setQuestions(qData.questions || []);
        setCategories(qData.categories || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  const categoryQuestions = questions.filter((q: any) => q.category === categories[currentCategory]);
  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", orgId, answers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch {
      alert("Error submitting assessment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i></div>;

  if (result) {
    const maturityLabels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-green-600 text-4xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h1>
            <p className="text-gray-500 mb-6">Your cybersecurity assessment has been processed successfully.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4"><p className="text-xs text-blue-600">Security Score</p><p className="text-3xl font-bold text-blue-700">{result.overallResult?.overallScore || result.assessment?.overallScore || 0}</p></div>
              <div className="bg-orange-50 rounded-xl p-4"><p className="text-xs text-orange-600">Risk Level</p><p className="text-lg font-bold text-orange-700 uppercase">{result.overallResult?.riskLevel || result.assessment?.riskLevel || "medium"}</p></div>
              <div className="bg-indigo-50 rounded-xl p-4"><p className="text-xs text-indigo-600">Maturity</p><p className="text-lg font-bold text-indigo-700">Level {result.overallResult?.maturityLevel || result.assessment?.maturityLevel || 1}</p></div>
            </div>

            {result.overallResult?.categoryScores && (
              <div className="text-left mb-6">
                <h3 className="font-semibold mb-3">Category Scores</h3>
                <div className="space-y-2">
                  {result.overallResult.categoryScores.map((cs: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-44 text-xs text-gray-600 truncate">{cs.category}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3"><div className="bg-blue-600 rounded-full h-3" style={{ width: `${cs.score}%` }}></div></div>
                      <span className="w-10 text-xs font-bold text-right">{cs.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">{result.recommendationsCount || 0} recommendations generated</p>
            <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block">
              <i className="fas fa-tachometer-alt mr-2"></i>View Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-cyan-400"></i><span className="font-bold">CyberShield Assessment</span></div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">{totalAnswered}/{totalQuestions} answered</span>
          <div className="w-32 bg-slate-700 rounded-full h-2"><div className="bg-cyan-400 rounded-full h-2" style={{ width: `${overallProgress}%` }}></div></div>
          <a href="/dashboard" className="text-slate-300 hover:text-white text-sm"><i className="fas fa-arrow-left mr-1"></i>Dashboard</a>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b px-6 py-2 overflow-x-auto">
        <div className="flex gap-1">
          {categories.map((cat, i) => {
            const catAnswered = questions.filter((q: any) => q.category === cat && answers[q.id]).length;
            const catTotal = questions.filter((q: any) => q.category === cat).length;
            const complete = catAnswered === catTotal;
            return (
              <button key={i} onClick={() => setCurrentCategory(i)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${currentCategory === i ? "bg-blue-600 text-white" : complete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {complete && <i className="fas fa-check mr-1"></i>}{cat.split(" & ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{categories[currentCategory]}</h2>
          <p className="text-sm text-gray-500">Category {currentCategory + 1} of {categories.length} • {categoryQuestions.length} questions</p>
        </div>

        <div className="space-y-4">
          {categoryQuestions.map((q: any, i: number) => (
            <div key={q.id} className="bg-white rounded-xl p-5 shadow-sm border">
              <p className="font-medium text-gray-800 mb-3">
                <span className="text-blue-600 mr-2">{i + 1}.</span>
                {q.question}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {answerOptions.map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(q.id, opt.value)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium text-left transition flex items-center gap-2 ${answers[q.id] === opt.value ? opt.color + " border-2" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                    <i className={`fas ${opt.icon}`}></i>{opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))} disabled={currentCategory === 0}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-30 hover:bg-gray-100">
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>
          {currentCategory < categories.length - 1 ? (
            <button onClick={() => setCurrentCategory(currentCategory + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold">
              Next Category<i className="fas fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || totalAnswered < totalQuestions * 0.5}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
              {submitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check mr-2"></i>}
              {submitting ? "Processing..." : "Submit Assessment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
