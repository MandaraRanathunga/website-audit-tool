export default function InsightsPanel({ insights }) {
  const categories = [
    { key: "seo_structure", label: "SEO Structure" },
    { key: "messaging_clarity", label: "Messaging Clarity" },
    { key: "cta_usage", label: "CTA Usage" },
    { key: "content_depth", label: "Content Depth" },
    { key: "ux_concerns", label: "UX Concerns" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 8, fontFamily: "var(--font-mono)" }}>
        AI-generated observations based on extracted page metrics.
      </p>

      {categories.map(({ key, label }) => {
        const data = insights[key];
        if (!data) return null;
        
        return (
          <div key={key} style={{ 
            padding: "24px", 
            background: "var(--surface)", 
            border: "1px solid var(--border)", 
            borderRadius: "10px" 
          }}>
            <h3 style={{ margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              {label} 
              <span style={{ 
                fontSize: "12px", 
                padding: "2px 8px", 
                background: "var(--border)", 
                borderRadius: "12px" 
              }}>{data.score}</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text)" }}>
              {data.observations.map((obs, i) => <li key={i} style={{ marginBottom: "8px", lineHeight: 1.5 }}>{obs}</li>)}
            </ul>
          </div>
        );
      })}
    </div>
  );
}