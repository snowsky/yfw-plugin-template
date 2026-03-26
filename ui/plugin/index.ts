/**
 * Plugin frontend entry point.
 *
 * Consumed by YourFinanceWORKS's plugin system (ui/src/App.tsx glob import).
 * Exports pluginRoutes, navItems, and pluginMetadata.
 *
 * Pages are imported from ui/shared/pages/ — no duplication with standalone.
 */
import React from "react";
import type { PluginRouteConfig, PluginNavItem } from "@/types/plugin-routes";

export const pluginMetadata = {
  name: "my-plugin",
  displayName: "My Plugin",
  version: "1.0.0",
  licenseTier: "agpl",
  description: "A YourFinanceWORKS plugin built from the template.",
};

// Lazy-load from shared pages — adjust the relative path if your ui/ is nested differently
const ExamplePage = React.lazy(() =>
  import("../shared/pages/ExamplePage").then((m) => ({ default: m.ExamplePage }))
);

export const pluginRoutes: PluginRouteConfig[] = [
  {
    path: "/my-plugin/example",
    component: ExamplePage,
    pluginId: "my-plugin",
    pluginName: "My Plugin",
    label: "Example",
  },
];

export const navItems: PluginNavItem[] = [
  {
    id: "my-plugin",
    path: "/my-plugin/example",
    label: "My Plugin",
    icon: "Puzzle",   // use any icon key from the host app's icon registry
    priority: 50,
  },
];

export const pluginFeatures: string[] = ["example"];
