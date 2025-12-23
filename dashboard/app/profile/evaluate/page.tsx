"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp, Target, AlertCircle, CheckCircle2, ExternalLink, Clock, Award, Users, BookOpen } from "lucide-react";
import { getProfile, analyzePortfolio, type StudentProfile, type Activity, type PortfolioAnalyzeResponse, type PortfolioAnalyzeRequest } from "@/lib/api";

export default function EvaluateProfilePage() {
  const router = useRouter();
  const studentId = "student_123"; // TODO: Get from auth context
  
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PortfolioAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis configuration
  const [config, setConfig] = useState({
    country_tracks: ["US"] as string[],
    schools: [""] as string[],
    deadlines: {} as Record<string, string>,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfile(studentId);
        setProfile(data.profile);
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  const handleAnalyze = async () => {
    if (!profile) {
      setError("Please complete your profile first");
      return;
    }

    if (activities.length === 0) {
      setError("Please add at least one activity to your portfolio");
      return;
    }

    // Validate schools
    const validSchools = config.schools.filter(s => s.trim() !== "");
    if (validSchools.length === 0) {
      setError("Please enter at least one school");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const request: PortfolioAnalyzeRequest = {
        country_tracks: config.country_tracks,
        schools: validSchools,
        deadlines: config.deadlines,
        weekly_hours_cap: profile.weekly_hours_cap || 8,
        student_profile: profile,
        portfolio: activities,
      };

      const result = await analyzePortfolio(request);
      setAnalysis(result);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze portfolio. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const updateSchool = (index: number, value: string) => {
    const newSchools = [...config.schools];
    newSchools[index] = value;
    setConfig({ ...config, schools: newSchools });
  };

  const addSchool = () => {
    setConfig({ ...config, schools: [...config.schools, ""] });
  };

  const removeSchool = (index: number) => {
    const newSchools = config.schools.filter((_, i) => i !== index);
    setConfig({ ...config, schools: newSchools });
  };

  const updateDeadline = (school: string, deadline: string) => {
    setConfig({
      ...config,
      deadlines: { ...config.deadlines, [school]: deadline },
    });
  };

  const lensColors: Record<string, string> = {
    Curiosity: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Growth: "bg-green-500/20 text-green-400 border-green-500/30",
    Community: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Creativity: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Leadership: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Achievements: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <main className="ml-64 overflow-y-auto">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <main className="ml-64 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-white text-2xl font-semibold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#0080ff]" />
              Evaluate Profile
            </h1>
            <p className="text-gray-400 mt-1">Analyze your portfolio and get personalized recommendations</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!profile ? (
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Profile Required</h3>
                <p className="text-gray-400 mb-6">Please complete your profile before analyzing</p>
                <Link
                  href="/profile/onboarding"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors font-medium"
                >
                  Complete Profile Setup
                </Link>
              </div>
            </div>
          ) : !analysis ? (
            <div className="space-y-6">
              {/* Configuration Section */}
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4">Analysis Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Country Tracks</label>
                    <div className="flex gap-2">
                      {["US", "UK", "EU"].map((track) => (
                        <label key={track} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.country_tracks.includes(track)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfig({ ...config, country_tracks: [...config.country_tracks, track] });
                              } else {
                                setConfig({ ...config, country_tracks: config.country_tracks.filter(t => t !== track) });
                              }
                            }}
                            className="w-4 h-4 rounded bg-white/5 border-white/10 text-[#0080ff] focus:ring-[#0080ff]"
                          />
                          <span className="text-gray-300">{track}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Target Schools</label>
                    <div className="space-y-2">
                      {config.schools.map((school, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={school}
                            onChange={(e) => updateSchool(index, e.target.value)}
                            placeholder="e.g., MIT, Harvard, Stanford"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                          />
                          <input
                            type="date"
                            value={config.deadlines[school] || ""}
                            onChange={(e) => updateDeadline(school, e.target.value)}
                            placeholder="Deadline"
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                          />
                          {config.schools.length > 1 && (
                            <button
                              onClick={() => removeSchool(index)}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addSchool}
                        className="text-sm text-[#0080ff] hover:text-[#0080ff]/80 transition-colors"
                      >
                        + Add School
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || activities.length === 0}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0080ff] hover:bg-[#0080ff]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Portfolio
                    </>
                  )}
                </button>
              </div>

              {/* Portfolio Summary */}
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4">Portfolio Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Activities</div>
                    <div className="text-2xl font-bold text-white">{activities.length}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Profile Status</div>
                    <div className="text-2xl font-bold text-green-400">Complete</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Weekly Hours Cap</div>
                    <div className="text-2xl font-bold text-white">{profile.weekly_hours_cap || 8}h</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Scores Overview */}
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0080ff]" />
                  Portfolio Scores
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Impact Total</div>
                    <div className="text-3xl font-bold text-white">{analysis.scores.impact_total.toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Coverage</div>
                    <div className="text-3xl font-bold text-white">{(analysis.scores.coverage * 100).toFixed(0)}%</div>
                  </div>
                  {analysis.scores.spike && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Spike Theme</div>
                      <div className="text-lg font-semibold text-white capitalize">{analysis.scores.spike.theme}</div>
                      <div className="text-sm text-gray-400">{(analysis.scores.spike.share * 100).toFixed(0)}% share</div>
                    </div>
                  )}
                </div>

                {/* Lens Scores */}
                <div>
                  <h3 className="text-white text-base font-semibold mb-3">Lens Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(analysis.scores.lens_scores).map(([lens, score]) => (
                      <div key={lens} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${lensColors[lens] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                            {lens}
                          </span>
                          <span className="text-white font-semibold">{score.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${score >= 7 ? "bg-green-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Critical Improvements */}
              {analysis.critical_improvements.length > 0 && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                  <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Critical Improvements
                  </h2>
                  <div className="space-y-4">
                    {analysis.critical_improvements.map((improvement, idx) => (
                      <div key={idx} className="bg-white/5 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold mb-1">{improvement.gap_description}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Severity:</span>
                              <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[200px]">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${improvement.severity * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{(improvement.severity * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          {improvement.tasks.map((task, taskIdx) => (
                            <div key={taskIdx} className="bg-[#0a0a1a] rounded-lg p-4 border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-white font-medium">{task.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  {task.estimated_hours}h
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-3">{task.micro_coaching}</p>
                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-2">Definition of Done:</div>
                                <ul className="space-y-1">
                                  {task.definition_of_done.map((item, itemIdx) => (
                                    <li key={itemIdx} className="text-sm text-gray-300 flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {task.quick_links.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {task.quick_links.map((link, linkIdx) => (
                                    <a
                                      key={linkIdx}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-[#0080ff] hover:text-[#0080ff]/80 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Resource
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lens Improvements */}
              {analysis.lens_improvements.length > 0 && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                  <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Lens Improvements
                  </h2>
                  <div className="space-y-4">
                    {analysis.lens_improvements.map((improvement, idx) => (
                      <div key={idx} className="bg-white/5 border border-yellow-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${lensColors[improvement.lens] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                                {improvement.lens}
                              </span>
                              <span className="text-white font-semibold">{improvement.current_score.toFixed(1)}/10</span>
                            </div>
                            <p className="text-sm text-gray-400">{improvement.improvement_opportunity}</p>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          {improvement.tasks.map((task, taskIdx) => (
                            <div key={taskIdx} className="bg-[#0a0a1a] rounded-lg p-4 border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-white font-medium">{task.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  {task.estimated_hours}h
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-3">{task.micro_coaching}</p>
                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-2">Definition of Done:</div>
                                <ul className="space-y-1">
                                  {task.definition_of_done.map((item, itemIdx) => (
                                    <li key={itemIdx} className="text-sm text-gray-300 flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {task.quick_links.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {task.quick_links.map((link, linkIdx) => (
                                    <a
                                      key={linkIdx}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-[#0080ff] hover:text-[#0080ff]/80 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Resource
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diversity & Spike */}
              {analysis.diversity_spike && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                  <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Diversity & Spike Analysis
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Has Spike</span>
                        {analysis.diversity_spike.has_spike ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      {analysis.diversity_spike.spike_theme && (
                        <div className="text-sm text-gray-400 mb-2">
                          Theme: <span className="text-white capitalize">{analysis.diversity_spike.spike_theme}</span>
                          {analysis.diversity_spike.spike_share && (
                            <span className="ml-2">({(analysis.diversity_spike.spike_share * 100).toFixed(0)}% share)</span>
                          )}
                        </div>
                      )}
                      <div className="text-sm text-gray-400">
                        Coverage Index: <span className="text-white">{(analysis.diversity_spike.coverage_index * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    {analysis.diversity_spike.needs_improvement && analysis.diversity_spike.tasks.length > 0 && (
                      <div className="space-y-3">
                        {analysis.diversity_spike.tasks.map((task, taskIdx) => (
                          <div key={taskIdx} className="bg-[#0a0a1a] rounded-lg p-4 border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-white font-medium">{task.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />
                                {task.estimated_hours}h
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{task.micro_coaching}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Alignment Priorities */}
              {analysis.alignment_priorities.length > 0 && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                  <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    School Alignment Priorities
                  </h2>
                  <div className="space-y-4">
                    {analysis.alignment_priorities.map((priority, idx) => (
                      <div key={idx} className={`bg-white/5 rounded-lg p-4 border ${priority.is_high_alignment ? "border-green-500/30" : "border-blue-500/30"}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold text-lg mb-1">{priority.school_name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Alignment Score:</span>
                              <span className={`text-lg font-bold ${priority.is_high_alignment ? "text-green-400" : "text-blue-400"}`}>
                                {(priority.alignment_score * 100).toFixed(0)}%
                              </span>
                              {priority.is_high_alignment && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">High Alignment</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{priority.alignment_notes}</p>
                        {priority.priority_tasks.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Priority Tasks:</div>
                            <ul className="space-y-1">
                              {priority.priority_tasks.map((taskTitle, taskIdx) => (
                                <li key={taskIdx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[#0080ff] mt-0.5 flex-shrink-0" />
                                  {taskTitle}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Tests */}
              {analysis.standardized_tests.length > 0 && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                  <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Standardized Test Analysis
                  </h2>
                  <div className="space-y-4">
                    {analysis.standardized_tests.map((test, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-3">{test.school_name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Test Policy</div>
                            <div className="text-white capitalize">{test.test_policy.replace(/_/g, " ")}</div>
                          </div>
                          {test.test_type && (
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Test Type</div>
                              <div className="text-white">{test.test_type}</div>
                            </div>
                          )}
                          {test.current_score && (
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Your Score</div>
                              <div className="text-white font-semibold">{test.current_score}</div>
                            </div>
                          )}
                          {test.mid50_scores && (
                            <div>
                              <div className="text-sm text-gray-400 mb-1">School Mid-50 Range</div>
                              <div className="text-white">{test.mid50_scores[0]} - {test.mid50_scores[2]}</div>
                            </div>
                          )}
                          {test.competitiveness && (
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Competitiveness</div>
                              <div className={`capitalize ${
                                test.competitiveness === "highly_competitive" ? "text-green-400" :
                                test.competitiveness === "competitive" ? "text-yellow-400" :
                                test.competitiveness === "below_competitive" ? "text-orange-400" :
                                "text-red-400"
                              }`}>
                                {test.competitiveness.replace(/_/g, " ")}
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Recommendation</div>
                            <div className={`font-semibold ${
                              test.recommendation === "submit" ? "text-green-400" :
                              test.recommendation === "dont_submit" ? "text-red-400" :
                              test.recommendation === "reschedule" ? "text-yellow-400" :
                              "text-gray-400"
                            }`}>
                              {test.recommendation.replace(/_/g, " ").toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{test.rationale}</p>
                        {test.tasks.length > 0 && (
                          <div className="space-y-2 mt-4">
                            {test.tasks.map((task, taskIdx) => (
                              <div key={taskIdx} className="bg-[#0a0a1a] rounded-lg p-3 border border-white/10">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-white font-medium text-sm">{task.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {task.estimated_hours}h
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400">{task.micro_coaching}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setError(null);
                  }}
                  className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Run New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

