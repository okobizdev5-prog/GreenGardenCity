import { Sidebar } from "@/components/admin/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Greenleaf Holdings Ltd.",
  description: "Admin panel for Greenleaf Holdings Ltd. real estate platform.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-8">
        {children}
      </main>
    </div>
  );
}
