"use client";

export default function Timeline() {
  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-bold">Backend (4)</h2>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffff]"></div>
            <span className="text-sm text-white font-medium">app</span>
          </div>
          <span className="text-sm text-white/50">3 files</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffff]"></div>
            <span className="text-sm text-white font-medium">app/ml</span>
          </div>
          <span className="text-sm text-white/50">3 files</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffff]"></div>
            <span className="text-sm text-white font-medium">code</span>
          </div>
          <span className="text-sm text-white/50">2 files</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffff]"></div>
            <span className="text-sm text-white font-medium">sre</span>
          </div>
          <span className="text-sm text-white/50">11 files</span>
        </div>
      </div>
    </div>
  );
}
