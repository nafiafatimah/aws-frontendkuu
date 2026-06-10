"use client";

import { useRouter } from "next/navigation";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token === null) {
      router.replace("/login");
      return null;
    }
  }

  return <>{children}</>;
}