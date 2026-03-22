import { useState } from "react";

export default function AuditForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        style={{
          flex: 1,
          minWidth: 260,
          padding: "14px 18px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text)",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--accent)")}
        onBlur={e => (e.target.style.borderColor = "var(--border)")}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "14px 28px",
          background: loading ? "var(--surface2)" : "var(--accent)",
          color: loading ? "var(--text-muted)" : "#0a0a0f",
          border: "none",
          borderRadius: 8,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.05em",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "Auditing…" : "Run Audit →"}
      </button>
    </form>
  );
}