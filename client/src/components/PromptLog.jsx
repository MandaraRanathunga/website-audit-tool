function Block({ title, content }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "var(--accent2)", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
        {title}
      </div>
      <pre style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "16px 18px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-muted)",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.7,
        maxHeight: 320,
        overflowY: "auto",
      }}>
        {content}
      </pre>
    </div>
  );
}

export default function PromptLog({ log }) {
  return (
    <div>
      <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 20 }}>
        Full prompt trace — system prompt, constructed user prompt, and raw model output. Log saved to <code style={{ color: "var(--accent)" }}>prompt-logs/{log.logFile}</code>
      </p>
      <Block title="System Prompt" content={log.systemPrompt} />
      <Block title="User Prompt (Constructed from Metrics)" content={log.userPrompt} />
      <Block title="Raw Model Output (Before Parse)" content={log.rawOutput} />
    </div>
  );
}
```

---

### `.env.example`
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001