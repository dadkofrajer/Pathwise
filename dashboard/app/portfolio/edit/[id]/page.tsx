"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getActivities, updateActivity, type Activity } from "@/lib/api";

const LENS_OPTIONS = ["Curiosity", "Growth", "Community", "Creativity", "Leadership", "Achievements"];
const TYPE_OPTIONS = ["Club", "Competition", "Research", "Startup", "Work", "Volunteering", "Project", "Certificate", "Award"];
const ROLE_LEVEL_OPTIONS = ["Member", "Core", "Lead", "Founder"];
const AWARD_LEVEL_OPTIONS = ["school", "regional", "national", "international"];

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  const studentId = "student_123"; // TODO: Get from auth context
  
  const [formData, setFormData] = useState({
    title: "",
    lens: "",
    type: "",
    area_of_activity: "",
    role_level: "",
    team_size: "",
    start_date: "",
    end_date: "",
    hours_per_week: "",
    awards: [] as Array<{ level: string }>,
  });
  const [newAwardLevel, setNewAwardLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadActivity() {
      try {
        const activities = await getActivities(studentId);
        const activity = activities.find(a => a.id === activityId);
        
        if (activity) {
          setFormData({
            title: activity.title,
            lens: activity.lens,
            type: activity.type,
            area_of_activity: activity.area_of_activity || "",
            role_level: activity.role_level,
            team_size: activity.team_size?.toString() || "",
            start_date: activity.start_date || "",
            end_date: activity.end_date || "",
            hours_per_week: activity.hours_per_week?.toString() || "",
            awards: activity.awards || [],
          });
        }
      } catch (error) {
        console.error("Failed to load activity:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (activityId) {
      loadActivity();
    }
  }, [activityId, studentId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAward = () => {
    if (newAwardLevel) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, { level: newAwardLevel }]
      }));
      setNewAwardLevel("");
    }
  };

  const handleRemoveAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const activityData: Activity = {
      id: activityId,
      title: formData.title,
      lens: formData.lens as any,
      type: formData.type as any,
      area_of_activity: formData.area_of_activity || undefined,
      role_level: formData.role_level as any,
      team_size: formData.team_size ? parseInt(formData.team_size) : undefined,
      hours_per_week: formData.hours_per_week ? parseFloat(formData.hours_per_week) : undefined,
      start_date: formData.start_date ? formData.start_date : undefined,
      end_date: formData.end_date ? formData.end_date : undefined,
      awards: formData.awards.length > 0 ? formData.awards : undefined,
      theme_tags: [],
      artifact_links: [],
    };
    
    try {
      console.log("Updating activity:", activityData);
      const result = await updateActivity(studentId, activityId, activityData);
      console.log("Activity updated successfully:", result);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update activity:", error);
      alert(`Failed to update activity: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console and try again.`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <main className="ml-64 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
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
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-white text-2xl font-semibold">Edit Activity</h1>
            <p className="text-gray-400 mt-1">Update the details about your activity</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., Robotics Team Lead"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category (Lens) *</label>
                    <select
                      required
                      value={formData.lens}
                      onChange={(e) => handleInputChange("lens", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                    >
                      <option value="">Select category</option>
                      {LENS_OPTIONS.map(lens => (
                        <option key={lens} value={lens} className="bg-[#0f0f23]">{lens}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                    >
                      <option value="">Select type</option>
                      {TYPE_OPTIONS.map(type => (
                        <option key={type} value={type} className="bg-[#0f0f23]">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Area of Activity</label>
                  <input
                    type="text"
                    value={formData.area_of_activity}
                    onChange={(e) => handleInputChange("area_of_activity", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., Volleyball, CS, Robotics"
                  />
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">Impact</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role Level *</label>
                  <select
                    required
                    value={formData.role_level}
                    onChange={(e) => handleInputChange("role_level", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                  >
                    <option value="">Select role level</option>
                    {ROLE_LEVEL_OPTIONS.map(level => (
                      <option key={level} value={level} className="bg-[#0f0f23]">{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Team Size (optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.team_size}
                    onChange={(e) => handleInputChange("team_size", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Awards (optional)</label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newAwardLevel}
                      onChange={(e) => setNewAwardLevel(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                    >
                      <option value="">Select award level</option>
                      {AWARD_LEVEL_OPTIONS.map(level => (
                        <option key={level} value={level} className="bg-[#0f0f23]">{level}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddAward}
                      className="px-4 py-2 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.awards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.awards.map((award, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#0080ff]/20 text-[#0080ff] rounded-lg text-sm"
                        >
                          {award.level}
                          <button
                            type="button"
                            onClick={() => handleRemoveAward(index)}
                            className="hover:text-[#0080ff]/70"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Duration Section */}
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">Duration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0080ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hours per Week</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    value={formData.hours_per_week}
                    onChange={(e) => handleInputChange("hours_per_week", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/profile"
                className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors font-medium ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

