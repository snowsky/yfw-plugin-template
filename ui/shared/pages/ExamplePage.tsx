/**
 * ExamplePage — demonstrates calling the shared API.
 *
 * Replace this with your feature page.
 * Works in both plugin mode (mounted in the host app's router) and
 * standalone mode (mounted in ui/standalone/src/App.tsx).
 */
import { useEffect, useState } from "react";
import { pluginApi, type HelloResponse } from "../api";

export function ExamplePage() {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pluginApi
      .hello()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "48px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Example Feature</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Replace this page with your domain feature. It calls{" "}
        <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>
          GET /api/v1/my-plugin/hello
        </code>
        .
      </p>

      {loading && <p>Loading…</p>}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <strong style={{ color: "#dc2626" }}>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <p>
            <strong>Message:</strong> {data.message}
          </p>
          <p>
            <strong>User:</strong> {data.user}
          </p>
        </div>
      )}
    </div>
  );
}
