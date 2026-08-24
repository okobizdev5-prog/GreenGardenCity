import { Sidebar } from "@/components/admin/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Green Garden City",
  description: "Admin panel for Green Garden City real estate platform.",
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
