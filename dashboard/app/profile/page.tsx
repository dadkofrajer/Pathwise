"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, User, Calendar, Award, Users, Clock, Edit, Trash2 } from "lucide-react";
import { getProfile, getActivities, deleteActivity, type Activity, type StudentProfile } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const studentId = "student_123"; // TODO: Get from auth context

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProfile(studentId);
      setProfile(data.profile);
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // If API call fails, set empty state (no profile, no activities)
      setProfile(null);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return;
    }
    
    try {
      await deleteActivity(studentId, activityId);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete activity:", error);
      alert("Failed to delete activity. Please try again.");
    }
  };

  const lensColors: Record<string, string> = {
    Curiosity: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Growth: "bg-green-500/20 text-green-400 border-green-500/30",
    Community: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Creativity: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Leadership: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Achievements: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <main className="ml-64 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Student Profile Section */}
          {!profile ? (
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6 mb-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No Profile Yet</h3>
                <p className="text-gray-400 mb-6">Complete your profile to get started</p>
                <Link
                  href="/profile/onboarding"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Complete Profile Setup
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/profile/edit"
              className="block bg-[#0f0f23] border border-white/20 rounded-xl p-4 mb-6 hover:bg-[#14142d] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0080ff]/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#0080ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white text-lg font-semibold mb-1">Student Profile</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="text-gray-400">{profile.current_grade}</span>
                      {profile.intended_major && (
                        <span className="text-gray-400">• {profile.intended_major}</span>
                      )}
                      {profile.gpa_unweighted && (
                        <span className="text-gray-400">• GPA: {profile.gpa_unweighted.toFixed(2)}</span>
                      )}
                      {profile.curriculum && (
                        <span className="text-gray-400">• {profile.curriculum}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors ml-4 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* Portfolio Section */}
          <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Portfolio Activities</h2>
              <Link
                href="/portfolio/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                {activities.length === 0 ? "Create Portfolio" : "Add Activity"}
              </Link>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">No Activities Yet</h3>
                  <p className="text-gray-400">Start building your portfolio by adding your first activity</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{activity.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${lensColors[activity.lens] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                            {activity.lens}
                          </span>
                          <span className="text-gray-400 text-sm">{activity.type}</span>
                        </div>
                        
                        {activity.area_of_activity && (
                          <p className="text-gray-400 text-sm mb-2">Area: {activity.area_of_activity}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.role_level}</span>
                          </div>
                          {activity.team_size && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Team: {activity.team_size}</span>
                            </div>
                          )}
                          {activity.hours_per_week && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{activity.hours_per_week}h/week</span>
                            </div>
                          )}
                          {activity.start_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(activity.start_date).toLocaleDateString()}
                                {activity.end_date ? ` - ${new Date(activity.end_date).toLocaleDateString()}` : " - Ongoing"}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {activity.awards && activity.awards.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-400">
                              Awards: {activity.awards.map(a => a.level).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/portfolio/edit/${activity.id}`}
                          className="p-2 text-gray-400 hover:text-[#0080ff] transition-colors"
                          title="Edit activity"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

