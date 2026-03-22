import { useState } from "react";
import AuditForm from "./components/AuditForm";
import MetricsPanel from "./components/MetricsPanel";
import InsightsPanel from "./components/InsightsPanel";
import RecommendationsPanel from "./components/RecommendationsPanel";
import PromptLog from "./components/PromptLog";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("metrics");

  async function handleAudit(url) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      let data;

      try {
        data = await res.json(); // ✅ FIXED
      } catch (err) {
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Audit failed");
      }

      setResult(data);
      setActiveTab("metrics");

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "metrics", label: "📊 Metrics" },
    { id: "insights", label: "🔍 Insights" },
    { id: "recommendations", label: "✅ Recommendations" },
    { id: "logs", label: "🧾 Prompt Logs" },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
      
      {/* Header */}
      <header style={{ marginBottom: 48 }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          EIGHT25MEDIA · AI Audit Tool
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800 }}>
          Website Audit
        </h1>

        <p style={{ marginTop: 8, maxWidth: 480 }}>
          Enter a URL to extract metrics and generate AI-powered insights.
        </p>
      </header>

      <AuditForm onSubmit={handleAudit} loading={loading} />

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 24,
          padding: "14px",
          background: "#1f0a0a",
          border: "1px solid red",
          borderRadius: 8,
          color: "red",
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 40 }}>

          {/* URL */}
          <div style={{
            marginBottom: 20,
            padding: "10px",
            border: "1px solid #333",
            borderRadius: 8,
          }}>
            <strong>Audited:</strong> {result.metrics?.url}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "8px 12px",
                  borderBottom: activeTab === t.id ? "2px solid blue" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          {activeTab === "metrics" && (
            <MetricsPanel metrics={result.metrics} />
          )}

          {activeTab === "insights" && (
            <InsightsPanel insights={result.aiReport} /> // ✅ FIXED
          )}

          {activeTab === "recommendations" && (
            <RecommendationsPanel
              recommendations={result.aiReport?.recommendations || []} // ✅ FIXED
            />
          )}

          {activeTab === "logs" && (
            <PromptLog log={result.promptLog || {}} />
          )}
        </div>
      )}
    </div>
  );
}