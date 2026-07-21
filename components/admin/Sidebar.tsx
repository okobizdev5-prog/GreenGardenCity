"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Folder,
  FileText,
  BookOpen,
  Users,
  MessageSquare,
  LogOut,
  UserCircle,
  Layout
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Hero Banner", href: "/admin/banner", icon: Layout },
    { name: "Inquiries", href: "/admin/bookings", icon: MessageSquare },
    { name: "Blog Posts", href: "/admin/blog", icon: BookOpen },
    { name: "Brochures", href: "/admin/brochures", icon: FileText },
    { name: "Team Members", href: "/admin/team", icon: Users },
  ];

  if (pathname === "/admin/login") {
    return null; // Don't show sidebar on login page
  }

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen shrink-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-green-800 tracking-tight">Greenleaf Holdings Ltd.</h1>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive
                  ? "bg-green-50 text-green-800 font-bold border-l-4 border-green-700 shadow-sm"
                  : "text-gray-600 hover:bg-green-50/50 hover:text-green-800"
                }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-green-700" : "text-gray-400"}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin User Info & Logout */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold shrink-0">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@greengarden.city</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
        >
          <LogOut className="h-4.5 w-4.5 text-red-500" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
