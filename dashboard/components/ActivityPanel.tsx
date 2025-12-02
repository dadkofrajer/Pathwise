"use client";

export default function ActivityPanel() {
  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-bold">Technologies Used</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff]"></div>
          <span className="text-sm text-white/70">Python</span>
        </div>
        <div className="flex items-center gap-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff]"></div>
          <span className="text-sm text-white/70">TensorFlow</span>
        </div>
        <div className="flex items-center gap-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff]"></div>
          <span className="text-sm text-white/70">NumPy</span>
        </div>
        <div className="flex items-center gap-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff]"></div>
          <span className="text-sm text-white/70">Pandas</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white mb-3">Languages</h4>
        <div className="space-y-1">
          <div className="text-sm text-white/70">Python</div>
          <div className="text-sm text-white/70">YAML</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white mb-3">Frameworks</h4>
        <div className="space-y-1">
          <div className="text-sm text-white/70">TensorFlow</div>
          <div className="text-sm text-white/70">Keras</div>
        </div>
      </div>
    </div>
  );
}
