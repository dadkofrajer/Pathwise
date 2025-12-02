"use client";

import Sidebar from "@/components/Sidebar";
import ActionCard from "@/components/ActionCard";
import Timeline from "@/components/Timeline";
import TodayMeetings from "@/components/TodayMeetings";
import TimeTracking from "@/components/TimeTracking";
import ActivityPanel from "@/components/ActivityPanel";
import { Building2, Network, Layers, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Top Navigation Header */}
        <header className="border-b border-white/20 bg-[#0f0f23] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Repository Architecture</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm text-white hover:text-[#00ffff] transition-colors font-medium">Home</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Company</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Dependency Map</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Architecture</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Story Parser</a>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <span className="text-sm text-white/70">SA</span>
                <span className="text-sm text-white font-medium">sanand96</span>
                <button className="text-sm text-white/70 hover:text-white transition-colors">Sign out</button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          {/* Repository Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">Select Repository</label>
            <select className="bg-[#0f0f23] border border-white/20 rounded-md px-4 py-2 text-white text-sm focus:outline-none focus:border-[#00ffff] transition-colors">
              <option>Bulu335/es4641-polymer-property-detection</option>
            </select>
          </div>

          {/* Summary Cards - Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ActionCard
              title="Total Modules"
              value={12}
              subtitle="26 files"
              icon={<Layers size={20} className="text-[#00ffff]" />}
              accent="cyan"
            />
            <ActionCard
              title="Connections"
              value={0}
              subtitle="dependencies"
              icon={<Network size={20} className="text-[#0080ff]" />}
              accent="blue"
            />
            <ActionCard
              title="Frontend"
              value={0}
              subtitle="0 files"
              icon={<FileText size={20} className="text-[#ff00ff]" />}
              accent="magenta"
            />
            <ActionCard
              title="Backend"
              value={4}
              subtitle="19 files"
              icon={<Building2 size={20} className="text-[#00d4ff]" />}
              accent="electric-blue"
            />
          </div>

          {/* Detailed Sections - Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Timeline Section */}
            <div className="lg:col-span-2">
              <Timeline />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              <TodayMeetings />
              <TimeTracking />
              <ActivityPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
