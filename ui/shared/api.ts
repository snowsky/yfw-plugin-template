/**
 * Shared API client base.
 *
 * In plugin mode:  all requests go to the host app at the same origin.
 * In standalone:   requests go to VITE_API_URL (the standalone backend).
 *
 * Add your domain-specific API methods below.
 */

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "";

const PLUGIN_PREFIX = "/api/v1/my-plugin";

// ── Auth header ──────────────────────────────────────────────────────────────

/** Returns auth headers. In plugin mode the browser cookie handles auth. */
function authHeaders(): Record<string, string> {
  const key = localStorage.getItem("yfw_api_key");
  return key ? { "X-API-Key": key } : {};
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Example API methods ──────────────────────────────────────────────────────

export interface HelloResponse {
  message: string;
  user: string;
}

export interface PluginInfoResponse {
  name: string;
  version: string;
  description: string;
}

export const pluginApi = {
  hello: () => request<HelloResponse>(`${PLUGIN_PREFIX}/hello`),
  info: () => request<PluginInfoResponse>(`${PLUGIN_PREFIX}/info`),
};

// ── Setup / connectivity ─────────────────────────────────────────────────────

export interface SetupConfig {
  apiUrl: string;
  apiKey: string;
}

/** Persist config in localStorage (standalone mode only). */
export function saveSetupConfig(config: SetupConfig): void {
  localStorage.setItem("yfw_api_url", config.apiUrl);
  localStorage.setItem("yfw_api_key", config.apiKey);
}

/** Load persisted config. */
export function loadSetupConfig(): SetupConfig {
  return {
    apiUrl: localStorage.getItem("yfw_api_url") ?? "",
    apiKey: localStorage.getItem("yfw_api_key") ?? "",
  };
}

/** Test connectivity to the YFW backend. */
export async function testConnection(apiUrl: string, apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/external/me`, {
      headers: { "X-API-Key": apiKey },
    });
    return res.ok;
  } catch {
    return false;
  }
}
