"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getProfile, updateProfile, type StudentProfile } from "@/lib/api";

export default function EditProfilePage() {
  const router = useRouter();
  const studentId = "student_123"; // TODO: Get from auth context
  
  const [formData, setFormData] = useState({
    student_id: studentId,
    current_grade: "",
    intended_major: "",
    gpa_unweighted: "",
    gpa_weighted: "",
    curriculum: "",
    weekly_hours_cap: "8",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile(studentId);
        if (data.profile) {
          setFormData({
            student_id: studentId,
            current_grade: data.profile.current_grade || "",
            intended_major: data.profile.intended_major || "",
            gpa_unweighted: data.profile.gpa_unweighted?.toString() || "",
            gpa_weighted: data.profile.gpa_weighted?.toString() || "",
            curriculum: data.profile.curriculum || "",
            weekly_hours_cap: data.profile.weekly_hours_cap?.toString() || "8",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [studentId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData: StudentProfile = {
      student_id: studentId,
      current_grade: formData.current_grade,
      intended_major: formData.intended_major || undefined,
      gpa_unweighted: formData.gpa_unweighted ? parseFloat(formData.gpa_unweighted) : undefined,
      gpa_weighted: formData.gpa_weighted ? parseFloat(formData.gpa_weighted) : undefined,
      curriculum: formData.curriculum || undefined,
      weekly_hours_cap: parseInt(formData.weekly_hours_cap) || 8,
      grades_by_subject: {},
      tests: {},
      constraints: [],
    };
    
    try {
      await updateProfile(studentId, profileData);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile. Please try again.");
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
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-white text-2xl font-semibold">Edit Student Profile</h1>
            <p className="text-gray-400 mt-1">Update your profile information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Grade *</label>
                  <input
                    type="text"
                    required
                    value={formData.current_grade}
                    onChange={(e) => handleInputChange("current_grade", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., Year 12, Grade 11"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Intended Major</label>
                  <input
                    type="text"
                    value={formData.intended_major}
                    onChange={(e) => handleInputChange("intended_major", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Curriculum</label>
                  <input
                    type="text"
                    value={formData.curriculum}
                    onChange={(e) => handleInputChange("curriculum", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="e.g., IB, AP, A-Levels"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Weekly Hours Cap</label>
                  <input
                    type="number"
                    min="2"
                    max="25"
                    value={formData.weekly_hours_cap}
                    onChange={(e) => handleInputChange("weekly_hours_cap", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">GPA (Unweighted)</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    value={formData.gpa_unweighted}
                    onChange={(e) => handleInputChange("gpa_unweighted", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="0.00 - 4.00"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">GPA (Weighted)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={formData.gpa_weighted}
                    onChange={(e) => handleInputChange("gpa_weighted", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="0.00 - 5.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/profile"
                className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

