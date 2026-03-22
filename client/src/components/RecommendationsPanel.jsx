const PRIORITY_COLORS = ["var(--danger)", "var(--warn)", "var(--accent2)", "var(--accent)", "var(--accent)"];

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations?.length) return <p style={{ color: "var(--text-muted)" }}>No recommendations generated.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 8 }}>
        Prioritized actions — ranked 1 (most critical) to 5.
      </p>
      {recommendations.map((rec, i) => {
        const color = PRIORITY_COLORS[i] || "var(--accent)";
        return (
          <div key={i} style={{
            padding: "22px 24px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: `4px solid ${color}`,
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{
                width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "50%",
                background: color,
                color: "#0a0a0f",
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {rec.priority}
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>{rec.title}</h3>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-display)", marginBottom: 4 }}>Why</div>
              <p style={{ fontSize: 14, color: "var(--text)" }}>{rec.reasoning}</p>
            </div>
            <div style={{
              padding: "10px 14px",
              background: "var(--surface2)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: color,
              borderLeft: `2px solid ${color}`,
            }}>
              → {rec.action}
            </div>
          </div>
        );
      })}
    </div>
  );
}