"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateProfile, type StudentProfile } from "@/lib/api";

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const studentId = "student_123"; // TODO: Get from auth context
  
  const [formData, setFormData] = useState({
    current_grade: "",
    intended_major: "",
    gpa_unweighted: "",
    gpa_weighted: "",
    curriculum: "",
    weekly_hours_cap: "8",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
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
      console.log("Saving profile:", profileData);
      const result = await updateProfile(studentId, profileData);
      console.log("Profile saved successfully:", result);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console and try again.`);
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.current_grade.trim() !== "";
    }
    return true;
  };

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
              Back
            </Link>
            <h1 className="text-white text-2xl font-semibold">Complete Your Profile</h1>
            <p className="text-gray-400 mt-1">Let's set up your student profile</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step === currentStep
                          ? "bg-[#0080ff] text-white"
                          : step < currentStep
                          ? "bg-[#0080ff]/50 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    <span className="text-xs text-gray-400 mt-2">
                      {step === 1 ? "Basic Info" : step === 2 ? "Academic" : "Preferences"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        step < currentStep ? "bg-[#0080ff]" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
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
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4">Academic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="bg-[#0f0f23] border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-lg font-semibold mb-4">Preferences</h2>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Weekly Hours Available</label>
                  <input
                    type="number"
                    min="2"
                    max="25"
                    value={formData.weekly_hours_cap}
                    onChange={(e) => handleInputChange("weekly_hours_cap", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0080ff] transition-colors"
                    placeholder="Hours per week"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many hours per week can you dedicate to activities?</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-6 py-2 border border-white/20 text-white rounded-lg transition-colors ${
                  currentStep === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/5"
                }`}
              >
                Back
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`px-6 py-2 bg-[#0080ff] text-white rounded-lg transition-colors font-medium ${
                    !isStepValid()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#0080ff]/80"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white rounded-lg transition-colors font-medium ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Complete Setup"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

