"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Target,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { PortfolioAnalysis, LensScores } from "@/lib/portfolio/types";
import { mockPortfolioAnalysis } from "@/lib/portfolio/mockData";
import { loadCachedPortfolioAnalysis } from "@/lib/portfolio/portfolioService";
import { generateTaskId } from "@/lib/learning/utils";

interface TaskManagerProps {
  data?: PortfolioAnalysis;
}

// Extract lens name from gap description (e.g., "Achievements lens is 0.0/10" -> "Achievements")
const extractLensName = (gapDescription: string): string => {
  const match = gapDescription.match(/^(\w+)\s+lens/);
  return match ? match[1] : gapDescription;
};

// Get lens score from scores
const getLensScore = (lensName: string, lensScores?: LensScores): number => {
  if (!lensScores) return 0;
  return lensScores[lensName as keyof LensScores] || 0;
};

// Get color based on score (0-10 scale)
const getScoreColor = (score: number): string => {
  if (score >= 7) return "#00ff00"; // Green
  if (score >= 4) return "#00d4ff"; // Cyan/Teal
  if (score >= 2) return "#ff6b00"; // Orange
  return "#ff00ff"; // Magenta/Pink
};

// Circular Progress Component
interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({ score, size = 120, strokeWidth = 8 }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / 10) * 100; // Convert 0-10 scale to percentage
  const offset = circumference - (percentage / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
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
          <div className="text-2xl font-bold text-white">{score.toFixed(1)}</div>
          <div className="text-xs text-white/50">/ 10</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskManager({ data }: TaskManagerProps) {
  const router = useRouter();
  // Use provided data, cached data, or fall back to mock data
  const portfolioData = data || loadCachedPortfolioAnalysis() || mockPortfolioAnalysis;
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const lensScores = portfolioData.scores?.lens_scores;

  const handleTaskClick = (task: any, lensName: string) => {
    const taskId = generateTaskId({ title: task.title, lensName });
    // Store task data in sessionStorage for the learning page
    sessionStorage.setItem(`task-${taskId}`, JSON.stringify({
      ...task,
      lensName,
    }));
    router.push(`/learning/${encodeURIComponent(taskId)}`);
  };

  const toggleTask = (taskTitle: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskTitle)) {
      newExpanded.delete(taskTitle);
    } else {
      newExpanded.add(taskTitle);
    }
    setExpandedTasks(newExpanded);
  };

  const toggleCard = (cardIndex: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardIndex)) {
      newExpanded.delete(cardIndex);
    } else {
      newExpanded.add(cardIndex);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="text-[#00ffff]" size={24} />
          <h2 className="text-white text-xl font-bold">Task Manager</h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioData.critical_improvements.map((improvement, gapIndex) => {
          const lensName = extractLensName(improvement.gap_description);
          const lensScore = getLensScore(lensName, lensScores);
          const scoreColor = getScoreColor(lensScore);
          const isCardExpanded = expandedCards.has(gapIndex);
          const previewTasks = isCardExpanded ? improvement.tasks : improvement.tasks.slice(0, 2);

          return (
            <div
              key={gapIndex}
              className="bg-[#0a0a1a] border border-white/20 rounded-lg p-6 hover:border-white/30 transition-all"
            >
              {/* Card Header with Progress Circle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-1">{lensName}</h3>
                  <p className="text-sm text-white/50">{improvement.gap_description}</p>
                </div>
                <CircularProgress score={lensScore} size={100} strokeWidth={6} />
              </div>

              {/* Task Preview Section */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">
                    Tasks ({improvement.tasks.length})
                  </h4>
                  <span className="text-xs text-white/50">
                    {improvement.tasks.reduce((sum, t) => sum + t.estimated_hours, 0)} hours total
                  </span>
                </div>

                {/* Task Previews */}
                <div className="space-y-2">
                  {previewTasks.map((task, taskIndex) => {
                    return (
                      <div
                        key={taskIndex}
                        className="bg-[#0f0f23] border border-white/10 rounded-md overflow-hidden hover:border-[#00d4ff]/30 transition-colors"
                      >
                        {/* Task Preview Header - Click to navigate to learning page */}
                        <div
                          className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => handleTaskClick(task, lensName)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 size={14} className="text-white/30 flex-shrink-0" />
                                <h5 className="text-sm font-medium text-white truncate">{task.title}</h5>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-white/50">
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{task.estimated_hours}h</span>
                                </div>
                                <div className="text-xs px-1.5 py-0.5 rounded bg-white/10">
                                  {task.track}
                                </div>
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-white/50 flex-shrink-0 mt-0.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show more indicator if there are more tasks */}
                {!isCardExpanded && improvement.tasks.length > 2 && (
                  <div className="text-xs text-white/50 text-center pt-1">
                    +{improvement.tasks.length - 2} more {improvement.tasks.length - 2 === 1 ? 'task' : 'tasks'}
                  </div>
                )}
              </div>

              {/* View All Tasks / Collapse Button */}
              {improvement.tasks.length > 2 && (
                <button
                  onClick={() => toggleCard(gapIndex)}
                  className="w-full mt-4 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: `${scoreColor}20`,
                    border: `1px solid ${scoreColor}40`,
                    color: scoreColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${scoreColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${scoreColor}20`;
                  }}
                >
                  {isCardExpanded ? 'Show Less' : 'View All Tasks'}
                  {isCardExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
