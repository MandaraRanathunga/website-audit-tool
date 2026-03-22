import { useState } from "react";

export default function AuditForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        style={{
          flex: 1,
          padding: "14px 18px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          fontSize: "16px",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "14px 28px",
          borderRadius: "8px",
          background: loading ? "var(--text-muted)" : "linear-gradient(135deg, var(--accent), var(--accent2))",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: loading ? "none" : "0 4px 6px -1px rgba(2, 132, 199, 0.3)",
          transition: "opacity 0.2s"
        }}
      >
        {loading ? "Auditing..." : "Run Audit"}
      </button>
    </form>
  );
}