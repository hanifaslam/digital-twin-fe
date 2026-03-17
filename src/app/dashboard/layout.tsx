"use client";

import { RouteGuard } from "@/components/guard/route-guard";
import { MainLayout } from "@/components/layout/main-layout";
import {
  extractHrefAndMiddleware,
  useMenuItems,
} from "@/components/navigation/sidebar/sidebar-menu";
import { ConfirmProvider } from "@/components/providers/confirm-dialog-provider";

import { MenuItem } from "@/types/layout-types";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";

function generateBreadcrumbs(pathname: string, menuItems: MenuItem[]) {
  const getPathWithoutLocale = (p: string) => {
    const parts = p.split("/").filter(Boolean);
    if (parts.length > 0 && (parts[0] === "en" || parts[0] === "id")) {
      return "/" + parts.slice(1).join("/");
    }
    return p;
  };

  const cleanPath = getPathWithoutLocale(pathname.split(/[?#]/)[0] || "/");

  const segments = cleanPath.split("/").filter(Boolean);

  const startsWithDashboard = segments[0] === "dashboard";
  const onlyDashboard = startsWithDashboard && segments.length === 1;

  const basePrefix = startsWithDashboard ? "/dashboard" : "";

  let displaySegments =
    startsWithDashboard && !onlyDashboard ? segments.slice(1) : segments;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const numericIdRegex = /^\d+$/;
  const randomIdRegex = /^[a-z0-9]{20,}$/i;
  const webIdRegex = /^WEB-[A-Z0-9]+$/i;

  displaySegments = displaySegments.filter((seg) => {
    if (
      uuidRegex.test(seg) ||
      objectIdRegex.test(seg) ||
      numericIdRegex.test(seg) ||
      randomIdRegex.test(seg) ||
      webIdRegex.test(seg)
    ) {
      return false;
    }

    return true;
  });

  const breadcrumbs: Array<{ label: string; href?: string }> = [];

  const menuEntries = extractHrefAndMiddleware(menuItems);
  const hrefSet = new Set(menuEntries.map((e) => e.href).filter(Boolean));

  for (let i = 0; i < displaySegments.length; i++) {
    const cumulative = displaySegments.slice(0, i + 1).join("/");
    const href =
      (basePrefix
        ? basePrefix + (cumulative ? "/" + cumulative : "")
        : "/" + cumulative) || "/";

    const raw = displaySegments[i];

    const labelOverrides: Record<string, string> = {
      cms: "CMS",
      faq: "FAQ",
    };

    const label =
      labelOverrides[raw.toLowerCase()] ||
      decodeURIComponent(raw)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());

    const includeHref = i !== displaySegments.length - 1 && hrefSet.has(href);

    breadcrumbs.push({
      label,
      href: includeHref ? href : undefined,
    });
  }

  if (breadcrumbs.length === 0 && cleanPath === "/") {
    breadcrumbs.push({ label: "Home" });
  }

  return breadcrumbs;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const menuItems = useMenuItems();
  const breadcrumbs = generateBreadcrumbs(pathname, menuItems);

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 1,
        errorRetryInterval: 2000,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
      }}
    >
      <RouteGuard>
        <ConfirmProvider>
          <MainLayout breadcrumbs={breadcrumbs}>{children}</MainLayout>
        </ConfirmProvider>
      </RouteGuard>
    </SWRConfig>
  );
}
