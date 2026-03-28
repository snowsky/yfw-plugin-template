/**
 * Plugin frontend entry point.
 *
 * Consumed by YourFinanceWORKS via import.meta.glob("./plugins/[*]/index.ts").
 * Must export: pluginRoutes, navItems, pluginIcons, pluginMetadata.
 *
 * Pages are lazy-loaded from ./pages/ — co-located here so the installed
 * plugin/ui/ directory is fully self-contained.
 */
import React from "react";
import { Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PluginRouteConfig, PluginNavItem } from "@/types/plugin-routes";

// ---------------------------------------------------------------------------
// Page component (lazy — loaded only when the user navigates to the route)
// ---------------------------------------------------------------------------
const ExamplePage = React.lazy(() =>
  import("./pages/ExamplePage").then((m) => ({ default: m.ExamplePage }))
);

// ---------------------------------------------------------------------------
// Plugin metadata
// ---------------------------------------------------------------------------
export const pluginMetadata = {
  name: "my-plugin",
  displayName: "My Plugin",
  version: "1.0.0",
  licenseTier: "agpl",
  description: "A YourFinanceWORKS plugin built from the template.",
};

// ---------------------------------------------------------------------------
// Route configuration
// ---------------------------------------------------------------------------
export const pluginRoutes: PluginRouteConfig[] = [
  {
    path: "/my-plugin/example",
    component: ExamplePage,
    pluginId: "my-plugin",
    pluginName: "My Plugin",
    label: "Example",
  },
];

// ---------------------------------------------------------------------------
// Sidebar nav item
// ---------------------------------------------------------------------------
export const navItems: PluginNavItem[] = [
  {
    id: "my-plugin",
    path: "/my-plugin/example",
    label: "My Plugin",
    icon: "Puzzle",
    priority: 50,
  },
];

// ---------------------------------------------------------------------------
// Plugin icons — merged into the host app's icon registry at runtime.
// Add any Lucide icons your navItems reference so they resolve correctly.
// ---------------------------------------------------------------------------
export const pluginIcons: Record<string, LucideIcon> = {
  Puzzle,
};

// ---------------------------------------------------------------------------
// Plugin features
// ---------------------------------------------------------------------------
export const pluginFeatures: string[] = ["example"];
