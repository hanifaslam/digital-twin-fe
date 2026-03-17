"use client";

import { useAuthGuard } from "@/hooks/use-auth-guards";
import LoadingAuth from "../loader/loading-auth";
import { ErrorPage } from "../common/tabs/error-page";
import { MenuProvider } from "../providers/menu-provider";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isLoading, isAuthenticated, filteredMenuItems, error } =
    useAuthGuard();

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (isLoading) {
    return <LoadingAuth />;
  }

  return isAuthenticated ? (
    <MenuProvider filteredMenuItems={filteredMenuItems}>
      {children}
    </MenuProvider>
  ) : null;
}
