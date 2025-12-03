"use client";

import { EssayAnalysis } from "@/lib/essays/types";

interface EssayScoreCardProps {
  analysis: EssayAnalysis;
  size?: "small" | "medium" | "large";
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return "#00ff00"; // Green
  if (score >= 6) return "#00d4ff"; // Cyan
  if (score >= 4) return "#ff6b00"; // Orange
  return "#ff00ff"; // Magenta/Pink
};

const getScoreLabel = (score: number): string => {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Needs Work";
};

export default function EssayScoreCard({ analysis, size = "medium" }: EssayScoreCardProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const scores = [
    { label: "Overall", value: analysis.overallScore, color: getScoreColor(analysis.overallScore) },
    { label: "Structure", value: analysis.structureScore, color: getScoreColor(analysis.structureScore) },
    { label: "Content", value: analysis.contentScore, color: getScoreColor(analysis.contentScore) },
    { label: "Tone", value: analysis.toneScore, color: getScoreColor(analysis.toneScore) },
    { label: "Alignment", value: analysis.promptAlignmentScore, color: getScoreColor(analysis.promptAlignmentScore) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {scores.map((score) => {
        const percentage = (score.value / 10) * 100;
        const radius = size === "small" ? 28 : size === "medium" ? 36 : 44;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
          <div key={score.label} className="flex flex-col items-center">
            <div className="relative" style={{ width: sizeClasses[size], height: sizeClasses[size] }}>
              <svg
                width={sizeClasses[size]}
                height={sizeClasses[size]}
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx={size === "small" ? 32 : size === "medium" ? 48 : 64}
                  cy={size === "small" ? 32 : size === "medium" ? 48 : 64}
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={size === "small" ? 4 : size === "medium" ? 6 : 8}
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx={size === "small" ? 32 : size === "medium" ? 48 : 64}
                  cy={size === "small" ? 32 : size === "medium" ? 48 : 64}
                  r={radius}
                  stroke={score.color}
                  strokeWidth={size === "small" ? 4 : size === "medium" ? 6 : 8}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`font-bold text-white ${textSizes[size]}`}>
                    {score.value.toFixed(1)}
                  </div>
                  <div className={`text-white/50 ${size === "small" ? "text-xs" : "text-xs"}`}>
                    / 10
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className={`text-white font-medium ${textSizes[size]}`}>{score.label}</div>
              <div
                className={`text-xs mt-0.5 ${size === "small" ? "text-[10px]" : ""}`}
                style={{ color: score.color }}
              >
                {getScoreLabel(score.value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

