"use client";

export default function TimeTracking() {
  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-bold">Shared (8)</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">app/ml/saved_models</span>
          </div>
          <span className="text-sm text-white/50">1 file</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">root</span>
          </div>
          <span className="text-sm text-white/50">1 file</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">hyperparameters</span>
          </div>
          <span className="text-sm text-white/50">9 files</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">results</span>
          </div>
          <span className="text-sm text-white/50">2 files</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">results/svm_linear_c500_30_all</span>
          </div>
          <span className="text-sm text-white/50">1 file</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
            <span className="text-sm text-white font-medium">results/svm_poly_c500_30_all</span>
          </div>
          <span className="text-sm text-white/50">1 file</span>
        </div>
      </div>
    </div>
  );
}
