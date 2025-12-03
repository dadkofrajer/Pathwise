"use client";

import Sidebar from "@/components/Sidebar";
import ApplicationTimeline from "@/components/ApplicationTimeline";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <main className="ml-64 overflow-y-auto">
        <div className="p-6">
          <ApplicationTimeline />
        </div>
      </main>
    </div>
  );
}
