function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      padding: "20px 22px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      borderLeft: `3px solid ${accent || "var(--accent)"}`,
    }}>
      <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-display)" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text)" }}>
        {value}
      </div>
      {sub && <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4, fontFamily: "var(--font-mono)" }}>{sub}</div>}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{
      padding: "14px 18px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      marginBottom: 8,
    }}>
      <div style={{ color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: value ? "var(--text)" : "var(--danger)",
        wordBreak: "break-word",
      }}>
        {value || "⚠ MISSING"}
      </div>
    </div>
  );
}

export default function MetricsPanel({ metrics }) {
  const altOk = metrics.images.missingAltPercent === 0;
  return (
    <div>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24, fontFamily: "var(--font-mono)" }}>
        Raw factual data — extracted directly from the page, no AI involved.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        <MetricCard label="Word Count" value={metrics.wordCount.toLocaleString()} />
        <MetricCard label="H1 Tags" value={metrics.headings.h1} accent={metrics.headings.h1 === 1 ? "var(--accent)" : "var(--danger)"} />
        <MetricCard label="H2 Tags" value={metrics.headings.h2} accent="var(--accent2)" />
        <MetricCard label="H3 Tags" value={metrics.headings.h3} accent="var(--accent2)" />
        <MetricCard label="CTAs Found" value={metrics.ctaCount} />
        <MetricCard label="Internal Links" value={metrics.links.internal} />
        <MetricCard label="External Links" value={metrics.links.external} />
        <MetricCard label="Total Images" value={metrics.images.total} sub={`${metrics.images.missingAlt} missing alt`} accent={altOk ? "var(--accent)" : "var(--warn)"} />
        <MetricCard
          label="Images w/o Alt"
          value={`${metrics.images.missingAltPercent}%`}
          accent={altOk ? "var(--accent)" : "var(--danger)"}
        />
      </div>

      <MetaRow label="Meta Title" value={metrics.metaTitle} />
      <MetaRow label="Meta Description" value={metrics.metaDescription} />
    </div>
  );
}