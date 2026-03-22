export default function PromptLog({ log }) {
  const preStyle = {
    background: "#1e1e1e",
    color: "#d4d4d4",
    padding: "16px",
    borderRadius: "8px",
    overflowX: "auto",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    fontFamily: "var(--font-mono)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, fontFamily: "var(--font-mono)" }}>
        Log saved backend side to: <strong>{log.logFile}</strong>
      </p>
      
      <div><strong style={{ display: "block", marginBottom: 8 }}>System Prompt:</strong><pre style={preStyle}>{log.systemPrompt}</pre></div>
      <div><strong style={{ display: "block", marginBottom: 8 }}>User Prompt:</strong><pre style={preStyle}>{log.userPrompt}</pre></div>
      <div><strong style={{ display: "block", marginBottom: 8 }}>Raw AI Output:</strong><pre style={preStyle}>{log.rawOutput}</pre></div>
    </div>
  );
}