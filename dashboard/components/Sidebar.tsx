"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Search, Settings, User, FileText } from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
    { icon: <FileText size={20} />, label: "Essays", href: "/essays" },
    { icon: <BarChart3 size={20} />, label: "Analytics", href: "/analytics" },
    { icon: <Search size={20} />, label: "Projects", href: "/projects" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="w-64 bg-[#1a1a1a] min-h-screen p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#2a2a2a] text-white border-l-4 border-[#60a5fa]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

