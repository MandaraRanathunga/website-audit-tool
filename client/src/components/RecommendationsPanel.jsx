export default function RecommendationsPanel({ recommendations }) {
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