/**
 * Standalone app router.
 *
 * Pages are imported from @shared (alias → ../../ui/shared) so they're
 * shared with the plugin entry without duplication.
 *
 * Routes:
 *   /         → redirect to /setup or /example depending on config
 *   /setup    → SetupPage (configure API URL + key)
 *   /example  → ExamplePage (replace with your feature page)
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { ExamplePage } from "@shared/pages/ExamplePage";
import { SetupPage } from "@shared/pages/SetupPage";
import { loadSetupConfig } from "@shared/api";

function Root() {
  const { apiKey } = loadSetupConfig();
  return <Navigate to={apiKey ? "/example" : "/setup"} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/setup" element={<SetupPage onSaved={() => (window.location.href = "/example")} />} />
      <Route path="/example" element={<ExamplePage />} />
    </Routes>
  );
}
