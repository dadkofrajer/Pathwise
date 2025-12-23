"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { EssayAnalysis } from "@/lib/essays/types";

interface EssayStrengthsWeaknessesProps {
  analysis: EssayAnalysis;
}

export default function EssayStrengthsWeaknesses({ analysis }: EssayStrengthsWeaknessesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="bg-[#2a2a2a]/30 backdrop-blur-xl border border-[#00ff00]/50 rounded-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={18} className="text-[#00ff00]" />
          <h3 className="text-white font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {analysis.strengths.length > 0 ? (
            analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                <span className="text-[#00ff00] mt-0.5">•</span>
                <span>{strength}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-white/50">No strengths identified</li>
          )}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-[#2a2a2a]/30 backdrop-blur-xl border border-[#ff00ff]/50 rounded-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <XCircle size={18} className="text-[#ff00ff]" />
          <h3 className="text-white font-semibold">Areas for Improvement</h3>
        </div>
        <ul className="space-y-2">
          {analysis.weaknesses.length > 0 ? (
            analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                <span className="text-[#ff00ff] mt-0.5">•</span>
                <span>{weakness}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-white/50">No weaknesses identified</li>
          )}
        </ul>
      </div>
    </div>
  );
}

