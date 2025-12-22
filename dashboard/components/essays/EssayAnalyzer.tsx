"use client";

import { useState } from "react";
import { EssayAnalysis, Essay } from "@/lib/essays/types";
import { analyzeEssayText, cacheAnalysis } from "@/lib/essays/essayAnalysisService";
import EssayScoreCard from "./EssayScoreCard";
import EssayStrengthsWeaknesses from "./EssayStrengthsWeaknesses";
import EssaySuggestionsList from "./EssaySuggestionsList";
import { Loader2, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface EssayAnalyzerProps {
  essay: Essay;
  onApplySuggestion?: (suggestion: EssayAnalysis["suggestions"][0]) => void;
}

export default function EssayAnalyzer({ essay, onApplySuggestion }: EssayAnalyzerProps) {
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  const handleAnalyze = async () => {
    if (!essay.content.trim()) {
      setError("Essay content is empty. Please write some content before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeEssayText(
        essay.content,
        essay.prompt,
        essay.wordLimit,
        essay.id
      );
      setAnalysis(result);
      cacheAnalysis(result);
      setLastAnalyzed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze essay");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerate = async () => {
    await handleAnalyze();
  };

  if (!analysis && !isAnalyzing && !error) {
    return (
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-8 text-center">
        <Sparkles size={48} className="text-[#00ffff] mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">Analyze Your Essay</h3>
        <p className="text-white/70 text-sm mb-6">
          Get AI-powered feedback on structure, content, tone, and prompt alignment
        </p>
        <button
          onClick={handleAnalyze}
          disabled={!essay.content.trim()}
          className="px-6 py-3 bg-[#00ffff] text-[#0a0a1a] rounded-md font-medium hover:bg-[#00d4ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          <Sparkles size={18} />
          Start Analysis
        </button>
        {!essay.content.trim() && (
          <p className="text-xs text-white/50 mt-3">Write some content first to analyze</p>
        )}
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-8 text-center">
        <Loader2 size={48} className="text-[#00ffff] mx-auto mb-4 animate-spin" />
        <h3 className="text-white text-lg font-semibold mb-2">Analyzing Essay...</h3>
        <p className="text-white/70 text-sm">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f0f23] border border-[#ff00ff]/20 rounded-md p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-[#ff00ff] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Analysis Error</h3>
            <p className="text-white/70 text-sm mb-4">{error}</p>
            <button
              onClick={handleAnalyze}
              className="px-4 py-2 bg-[#00ffff] text-[#0a0a1a] rounded-md text-sm font-medium hover:bg-[#00d4ff] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-bold mb-1">Essay Analysis</h3>
          {lastAnalyzed && (
            <p className="text-xs text-white/50">
              Analyzed {lastAnalyzed.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-[#0f0f23] border border-white/20 text-white rounded-md text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw size={16} className={isAnalyzing ? "animate-spin" : ""} />
          Regenerate
        </button>
      </div>

      {/* Score Cards */}
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
        <h4 className="text-white font-semibold mb-4">Scores</h4>
        <EssayScoreCard analysis={analysis} size="medium" />
      </div>

      {/* Strengths & Weaknesses */}
      <EssayStrengthsWeaknesses analysis={analysis} />

      {/* Readability & Word Count */}
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-4">
        <h4 className="text-white font-semibold mb-3">Readability & Word Count</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-white/50 mb-1">Readability Score</div>
            <div className="text-2xl font-bold text-white">
              {analysis.readabilityScore.toFixed(0)}
            </div>
            <div className="text-xs text-white/50 mt-1">
              {analysis.readabilityScore >= 60
                ? "Easy to read"
                : analysis.readabilityScore >= 30
                ? "Moderate difficulty"
                : "Difficult to read"}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Word Count</div>
            <div className="text-2xl font-bold text-white">{analysis.wordCount}</div>
            {analysis.targetWordCount && (
              <div className="text-xs text-white/50 mt-1">
                Target: {analysis.targetWordCount}
                {analysis.wordCount > analysis.targetWordCount && (
                  <span className="text-[#ff00ff] ml-2">
                    (Over by {analysis.wordCount - analysis.targetWordCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6">
        <h4 className="text-white font-semibold mb-4">Improvement Suggestions</h4>
        <EssaySuggestionsList
          suggestions={analysis.suggestions}
          onApplySuggestion={onApplySuggestion}
        />
      </div>
    </div>
  );
}

