"use client";

import { useState } from "react";
import { EssaySuggestion, SuggestionType } from "@/lib/essays/types";
import { AlertCircle, CheckCircle2, Lightbulb, Filter, X } from "lucide-react";

interface EssaySuggestionsListProps {
  suggestions: EssaySuggestion[];
  onApplySuggestion?: (suggestion: EssaySuggestion) => void;
}

const getPriorityColor = (priority: EssaySuggestion["priority"]): string => {
  switch (priority) {
    case "high":
      return "#ff00ff";
    case "medium":
      return "#ff6b00";
    case "low":
      return "#00d4ff";
  }
};

const getTypeLabel = (type: SuggestionType): string => {
  const labels: Record<SuggestionType, string> = {
    structure: "Structure",
    content: "Content",
    tone: "Tone",
    grammar: "Grammar",
    clarity: "Clarity",
    prompt_alignment: "Prompt Alignment",
  };
  return labels[type];
};

const getTypeIcon = (type: SuggestionType) => {
  switch (type) {
    case "structure":
      return "📐";
    case "content":
      return "📝";
    case "tone":
      return "🎭";
    case "grammar":
      return "✓";
    case "clarity":
      return "💡";
    case "prompt_alignment":
      return "🎯";
    default:
      return "•";
  }
};

export default function EssaySuggestionsList({
  suggestions,
  onApplySuggestion,
}: EssaySuggestionsListProps) {
  const [filterType, setFilterType] = useState<SuggestionType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredSuggestions = suggestions.filter((s) => {
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterPriority !== "all" && s.priority !== filterPriority) return false;
    return true;
  });

  const uniqueTypes = Array.from(new Set(suggestions.map((s) => s.type)));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-white/50" />
          <span className="text-sm text-white/70">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-[#00ffff] text-[#0a0a1a]"
                : "bg-[#0f0f23] border border-white/20 text-white/70 hover:text-white"
            }`}
          >
            All Types
          </button>
          {uniqueTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterType === type
                  ? "bg-[#00ffff] text-[#0a0a1a]"
                  : "bg-[#0f0f23] border border-white/20 text-white/70 hover:text-white"
              }`}
            >
              {getTypeIcon(type)} {getTypeLabel(type)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {(["all", "high", "medium", "low"] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterPriority === priority
                  ? "bg-[#00ffff] text-[#0a0a1a]"
                  : "bg-[#0f0f23] border border-white/20 text-white/70 hover:text-white"
              }`}
            >
              {priority === "all" ? "All" : priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-[#0f0f23] border border-white/20 rounded-md p-4 hover:border-white/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                    <span className="text-sm font-semibold text-white">
                      {getTypeLabel(suggestion.type)}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${getPriorityColor(suggestion.priority)}20`,
                        color: getPriorityColor(suggestion.priority),
                        border: `1px solid ${getPriorityColor(suggestion.priority)}40`,
                      }}
                    >
                      {suggestion.priority.toUpperCase()}
                    </span>
                    {suggestion.location && (
                      <span className="text-xs text-white/50">• {suggestion.location}</span>
                    )}
                  </div>

                  <p className="text-sm text-white/80 mb-3">{suggestion.explanation}</p>

                  {suggestion.currentText && (
                    <div className="mb-2">
                      <div className="text-xs text-white/50 mb-1">Current:</div>
                      <div className="bg-[#0a0a1a] border border-white/10 rounded-md px-3 py-2 text-sm text-white/70">
                        {suggestion.currentText}
                      </div>
                    </div>
                  )}

                  {suggestion.suggestedText && (
                    <div>
                      <div className="text-xs text-white/50 mb-1">Suggested:</div>
                      <div className="bg-[#0a0a1a] border border-[#00ffff]/30 rounded-md px-3 py-2 text-sm text-[#00ffff]">
                        {suggestion.suggestedText}
                      </div>
                    </div>
                  )}
                </div>

                {onApplySuggestion && suggestion.suggestedText && (
                  <button
                    onClick={() => onApplySuggestion(suggestion)}
                    className="px-3 py-1.5 bg-[#00ffff] text-[#0a0a1a] rounded-md text-xs font-medium hover:bg-[#00d4ff] transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#0f0f23] border border-white/20 rounded-md p-8 text-center">
            <AlertCircle size={24} className="text-white/50 mx-auto mb-2" />
            <p className="text-white/70">No suggestions match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

