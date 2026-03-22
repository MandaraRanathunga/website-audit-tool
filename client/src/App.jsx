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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
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
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          EIGHT25MEDIA · AI Audit Tool
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "var(--text)" }}>
          Website Audit
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 480 }}>
          Enter a URL to extract factual metrics and generate AI-powered SEO, messaging, and UX insights.
        </p>
      </header>

      <AuditForm onSubmit={handleAudit} loading={loading} />

      {error && (
        <div style={{
          marginTop: 24,
          padding: "14px 18px",
          background: "#1f0a0a",
          border: "1px solid var(--danger)",
          borderRadius: 8,
          color: "var(--danger)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 40 }}>
          {/* URL badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
            padding: "10px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}>
            <span style={{ color: "var(--accent)", fontSize: 12, fontFamily: "var(--font-mono)" }}>AUDITED</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {result.url}
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 0,
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "10px 18px",
                background: "none",
                border: "none",
                borderBottom: activeTab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeTab === t.id ? "var(--accent)" : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.03em",
                transition: "all 0.15s",
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "metrics" && <MetricsPanel metrics={result.metrics} />}
          {activeTab === "insights" && <InsightsPanel insights={result.insights} />}
          {activeTab === "recommendations" && <RecommendationsPanel recommendations={result.insights.recommendations} />}
          {activeTab === "logs" && <PromptLog log={result.promptLog} />}
        </div>
      )}
    </div>
  );
}