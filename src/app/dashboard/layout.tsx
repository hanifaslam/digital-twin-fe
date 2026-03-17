import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Twin",
  description: "Digital Twin",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
