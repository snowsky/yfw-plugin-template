/**
 * SetupPage — configure the YourFinanceWORKS API URL and API key.
 *
 * Shown only in standalone mode. In plugin mode the host app handles auth.
 *
 * To obtain an API key:
 *   YourFinanceWORKS → Settings → API Access → Create Key
 *   (requires the "external_api" license feature to be enabled)
 */
import { useState } from "react";
import type { CSSProperties } from "react";
import { loadSetupConfig, saveSetupConfig, testConnection } from "../api";

interface Props {
  onSaved?: () => void;
}

export function SetupPage({ onSaved }: Props) {
  const saved = loadSetupConfig();
  const [apiUrl, setApiUrl] = useState(saved.apiUrl || "http://localhost:8000");
  const [apiKey, setApiKey] = useState(saved.apiKey);
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleTest() {
    setStatus("testing");
    setError("");
    const ok = await testConnection(apiUrl, apiKey);
    setStatus(ok ? "ok" : "error");
    if (!ok) setError("Connection failed. Check the URL and API key.");
  }

  function handleSave() {
    saveSetupConfig({ apiUrl, apiKey });
    onSaved?.();
  }

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Plugin Setup</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Connect this plugin to your YourFinanceWORKS instance.
      </p>

      <label style={labelStyle}>
        YourFinanceWORKS URL
        <input
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="https://app.yourfinanceworks.com"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        API Key
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="ak_..."
          style={inputStyle}
        />
        <span style={{ fontSize: 12, color: "#888" }}>
          Generate in YFW → Settings → API Access → Create Key
        </span>
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <button onClick={handleTest} disabled={status === "testing"} style={btnOutline}>
          {status === "testing" ? "Testing…" : "Test Connection"}
        </button>
        <button onClick={handleSave} disabled={!apiUrl || !apiKey} style={btnPrimary}>
          Save
        </button>
      </div>

      {status === "ok" && (
        <p style={{ color: "#16a34a", marginTop: 12, fontSize: 14 }}>Connected successfully.</p>
      )}
      {status === "error" && (
        <p style={{ color: "#dc2626", marginTop: 12, fontSize: 14 }}>{error}</p>
      )}
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginBottom: 16,
  fontSize: 14,
  fontWeight: 500,
};

const inputStyle: CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  outline: "none",
};

const btnPrimary: CSSProperties = {
  padding: "8px 20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
};

const btnOutline: CSSProperties = {
  ...btnPrimary,
  background: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
};
