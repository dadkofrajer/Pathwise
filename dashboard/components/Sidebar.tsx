"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Search, 
  User, 
  FileText, 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Percent,
  GraduationCap,
  Lightbulb,
  Book,
  List,
  FileCheck
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
  defaultExpanded?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['planning-tools']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const sections: { id: string; section: NavSection }[] = [
    {
      id: 'frequently-used',
      section: {
        title: 'FREQUENTLY USED',
        icon: <Clock size={14} />,
        items: [
          { icon: <FileCheck size={18} />, label: 'Application Tracker', href: '/applications' },
          { icon: <List size={18} />, label: 'Essay Manager', href: '/essays' },
          { icon: <Percent size={18} />, label: 'Chance Me', href: '/chance-me' },
          { icon: <BarChart3 size={18} />, label: 'Evaluate Profile', href: '/evaluate' },
          { icon: <GraduationCap size={18} />, label: 'Counselor Connect', href: '/counselor', badge: 'New' },
        ],
      },
    },
    {
      id: 'planning-tools',
      section: {
        title: 'PLANNING TOOLS',
        icon: <BarChart3 size={14} />,
        items: [
          { icon: <BarChart3 size={18} />, label: 'Evaluate Profile', href: '/evaluate-profile' },
          { icon: <Percent size={18} />, label: 'Chance Me', href: '/chance-me-tool' },
          { icon: <Search size={18} />, label: 'College Match', href: '/college-match' },
        ],
        defaultExpanded: true,
      },
    },
    {
      id: 'application-tools',
      section: {
        title: 'APPLICATION TOOLS',
        icon: <FileText size={14} />,
        items: [
          { icon: <FileCheck size={18} />, label: 'Application Tracker', href: '/tracker' },
          { icon: <List size={18} />, label: 'Essay Manager', href: '/essays' },
        ],
      },
    },
    {
      id: 'guidance',
      section: {
        title: 'GUIDANCE',
        icon: <Lightbulb size={14} />,
        items: [
          { icon: <GraduationCap size={18} />, label: 'Counselor Connect', href: '/counselor' },
          { icon: <BarChart3 size={18} />, label: 'Evaluate Profile', href: '/evaluate' },
        ],
      },
    },
    {
      id: 'resources',
      section: {
        title: 'RESOURCES',
        icon: <Book size={14} />,
        items: [
          { icon: <Book size={18} />, label: 'Resource Library', href: '/resources' },
        ],
      },
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-[#0a0a1a] border-r border-white/20 flex flex-col transition-all duration-300 ease-in-out z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} className="text-white/70" />
            ) : (
              <ChevronLeft size={16} className="text-white/70" />
            )}
          </button>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              {/* Logo - Stacked blocks */}
              <div className="flex flex-col gap-0.5">
                <div className="w-3.5 h-2 bg-[#0080ff] rounded-sm"></div>
                <div className="w-3.5 h-2 bg-[#0080ff] rounded-sm"></div>
                <div className="w-3.5 h-2 bg-[#0080ff] rounded-sm"></div>
              </div>
              <h1 className="text-white text-base font-semibold tracking-tight">AppTrack</h1>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top-level Navigation */}
        <div className="p-2 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            } ${
              isActive('/')
                ? 'bg-[#0080ff] text-white'
                : 'text-white hover:bg-white/5'
            }`}
            title={isCollapsed ? 'Dashboard' : undefined}
          >
            <LayoutDashboard size={18} className={isActive('/') ? 'text-white' : 'text-white/70'} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Dashboard</span>
            )}
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            } ${
              isActive('/profile')
                ? 'bg-[#0080ff] text-white'
                : 'text-white hover:bg-white/5'
            }`}
            title={isCollapsed ? 'My Profile' : undefined}
          >
            <User size={18} className={isActive('/profile') ? 'text-white' : 'text-white/70'} />
            {!isCollapsed && (
              <span className="text-sm font-medium">My Profile</span>
            )}
          </Link>
        </div>

        {/* Sectioned Navigation */}
        {!isCollapsed && (
          <div className="mt-4 space-y-1">
            {sections.map(({ id, section }) => {
              const isExpanded = expandedSections.has(id);
              const hasChevron = id !== 'frequently-used';

              return (
                <div key={id} className="border-t border-white/10 first:border-t-0">
                  {/* Section Header */}
                  <button
                    onClick={() => hasChevron && toggleSection(id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-white/50 hover:text-white/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {section.title}
                      </span>
                    </div>
                    {hasChevron && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
                      />
                    )}
                  </button>

                  {/* Section Items */}
                  {(!hasChevron || isExpanded) && (
                    <div className="px-2 pb-2 space-y-1">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                              active
                                ? 'bg-[#0080ff] text-white'
                                : 'text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={active ? 'text-white' : 'text-white/70'}>
                                {item.icon}
                              </span>
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-[#0080ff] text-white text-xs font-medium rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsed Navigation - Show only icons */}
        {isCollapsed && (
          <div className="mt-4 space-y-1">
            {sections.find(s => s.id === 'frequently-used')?.section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-[#0080ff] text-white'
                      : 'text-white hover:bg-white/5'
                  }`}
                  title={item.label}
                >
                  <span className={active ? 'text-white' : 'text-white/70'}>
                    {item.icon}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
