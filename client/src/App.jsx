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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* Top Header */}
      <header style={{ padding: "20px 40px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "18px", letterSpacing: "0.05em" }}>
            EIGHT25MEDIA
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            · AI Audit Tool
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 960, margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        {/* Hero Section */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, margin: "0 0 16px 0", color: "var(--text)" }}>
          Website Audit
        </h1>

        <p style={{ margin: "0 auto", maxWidth: 540, color: "var(--text-muted)", fontSize: "18px", lineHeight: 1.6 }}>
          Enter a URL to extract metrics and generate AI-powered insights.
        </p>
        </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <AuditForm onSubmit={handleAudit} loading={loading} />
      </div>

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
        <div style={{ marginTop: 48 }}>

          {/* URL */}
          <div style={{
            marginBottom: 32,
            padding: "16px 24px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
          }}>
            <span style={{ color: "var(--text-muted)", marginRight: 8 }}>Audited:</span>
            <strong style={{ color: "var(--accent)", fontSize: "16px", wordBreak: "break-all" }}>{result.metrics?.url}</strong>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  border: activeTab === t.id ? "1px solid transparent" : "1px solid var(--border)",
                  background: activeTab === t.id ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface)",
                  color: activeTab === t.id ? "#fff" : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === t.id ? "0 4px 6px -1px rgba(2, 132, 199, 0.3)" : "none"
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
            <RecommendationsPanel insights={result.aiReport} />
          )}

          {activeTab === "logs" && (
            <PromptLog log={result.promptLog || {}} />
          )}
        </div>
      )}
      </main>

      {/* Footer */}
      <footer style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "24px 40px",
      }}>
        <div style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "end",
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}>
          <div style={{ textAlign: "left" }}>
            Developed by Mandara Ranathunga
          </div>
          <div style={{ textAlign: "center" }}>
            All rights reserved.
          </div>
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            EIGHT25MEDIA<br />AI Audit Tool
          </div>
        </div>
      </footer>
    </div>
  );
}