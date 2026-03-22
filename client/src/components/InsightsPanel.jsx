const SCORE_COLORS = {
  Good: "var(--accent)",
  Fair: "var(--warn)",
  Poor: "var(--danger)",
};

const SECTIONS = [
  { key: "seo_structure", label: "SEO Structure" },
  { key: "messaging_clarity", label: "Messaging Clarity" },
  { key: "cta_usage", label: "CTA Usage" },
  { key: "content_depth", label: "Content Depth" },
  { key: "ux_concerns", label: "UX Concerns" },
];

export default function InsightsPanel({ insights }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 8 }}>
        AI-generated analysis — grounded in the factual metrics above.
      </p>

      {SECTIONS.map(({ key, label }) => {
        const section = insights[key];
        if (!section) return null;
        const color = SCORE_COLORS[section.score] || "var(--text-muted)";

        return (
          <div key={key} style={{
            padding: "20px 22px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>{label}</h3>
              <span style={{
                padding: "3px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                border: `1px solid ${color}`,
                color,
              }}>
                {section.score?.toUpperCase()}
              </span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {section.observations?.map((obs, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "var(--text)", fontSize: 14 }}>
                  <span style={{ color, marginTop: 2 }}>›</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}