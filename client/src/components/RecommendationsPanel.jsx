export default function RecommendationsPanel({ insights }) {
  if (!insights) return null;

  // If the AI or backend returns an error, display it clearly
  if (insights.error) {
    return (
      <div style={{ padding: "20px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", border: "1px solid #f87171" }}>
        <strong>⚠️ AI Analysis Failed:</strong> {insights.error}
        {insights.details && <div style={{ marginTop: "8px", fontSize: "14px" }}>{insights.details}</div>}
      </div>
    );
  }

  // Handle potential AI nesting (e.g., if it wraps the output in an "insights" object)
  const targetData = insights.recommendations ? insights : (insights.insights || insights);
  const recommendations = targetData.recommendations || targetData.Recommendations || [];

  if (!recommendations || recommendations.length === 0) {
    return <p>No recommendations available.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {recommendations.map((rec, i) => (
        <div key={i} style={{ 
          padding: "20px", 
          background: "var(--surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "8px", 
          borderLeft: `4px solid var(--accent)` 
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px" }}>
            #{rec.priority} — {rec.title}
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>{rec.reasoning}</div>
          <div style={{ fontSize: "14px", fontWeight: "bold", background: "#f1f5f9", padding: "10px", borderRadius: "6px" }}>Action: {rec.action}</div>
        </div>
      ))}
    </div>
  );
}