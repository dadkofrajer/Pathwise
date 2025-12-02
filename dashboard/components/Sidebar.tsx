"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Search, Settings, User, FileText, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
    { icon: <FileText size={20} />, label: "Essays", href: "/essays" },
    { icon: <BarChart3 size={20} />, label: "Analytics", href: "/analytics" },
    { icon: <Search size={20} />, label: "Projects", href: "/projects" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
  ];

  return (
    <div className={`relative bg-[#0a0a1a] border-r border-white/20 transition-all duration-300 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Brand/Logo Section */}
      <div className={`p-6 border-b border-white/20 transition-all duration-300 ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-[#0f0f23] border border-white/20 rounded-md flex-shrink-0">
            <GraduationCap size={24} className="text-[#00ffff]" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-white text-lg font-bold tracking-tight">CodeOrbit</h1>
              <p className="text-xs text-white/50">Repository Explorer</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ease-in-out group ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? "bg-[#0f0f23] text-white border-l-2 border-[#00ffff]"
                  : "text-white/70 hover:text-white hover:bg-[#0f0f23]"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={isActive ? "text-[#00ffff]" : "text-white/50 group-hover:text-white transition-colors flex-shrink-0"}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? "text-white" : "text-white/70"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-[#0f0f23] rounded-md transition-all duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
