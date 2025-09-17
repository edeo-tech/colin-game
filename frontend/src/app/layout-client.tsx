"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/ui/Footer";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}