"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AIChat from "@/components/learning/AIChat";
import { LearningTask, TaskStep, TaskProgress } from "@/lib/learning/types";
import { parseSteps, calculateProgress, getNextStep } from "@/lib/learning/utils";
import { loadTaskProgress, initializeProgress, completeStep, uncompleteStep } from "@/lib/learning/progressService";
import { CheckCircle2, Clock, ExternalLink, ArrowLeft, BookOpen, Target } from "lucide-react";

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = decodeURIComponent(params.taskId as string);
  
  const [task, setTask] = useState<LearningTask | null>(null);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<TaskStep | null>(null);

  useEffect(() => {
    // Load task data from sessionStorage
    const taskData = sessionStorage.getItem(`task-${taskId}`);
    if (taskData) {
      const parsedTask: LearningTask = JSON.parse(taskData);
      setTask(parsedTask);
      
      // Parse steps from definition_of_done
      const parsedSteps = parseSteps(parsedTask);
      setSteps(parsedSteps);
      
      // Load or initialize progress
      let taskProgress = loadTaskProgress(taskId);
      if (!taskProgress) {
        taskProgress = initializeProgress(taskId);
      }
      setProgress(taskProgress);
      
      // Update step completion status
      const updatedSteps = parsedSteps.map(step => ({
        ...step,
        completed: taskProgress.completedSteps.includes(step.id),
      }));
      setSteps(updatedSteps);
      
      // Set current step
      const next = getNextStep(updatedSteps);
      setCurrentStep(next || updatedSteps[updatedSteps.length - 1]);
    } else {
      // Task not found, redirect back
      router.push("/");
    }
  }, [taskId, router]);

  const handleStepToggle = (stepId: string) => {
    if (!progress) return;
    
    const isCompleted = progress.completedSteps.includes(stepId);
    if (isCompleted) {
      uncompleteStep(taskId, stepId);
    } else {
      completeStep(taskId, stepId);
    }
    
    // Reload progress
    const updatedProgress = loadTaskProgress(taskId);
    setProgress(updatedProgress);
    
    // Update steps
    const updatedSteps = steps.map(step => ({
      ...step,
      completed: updatedProgress?.completedSteps.includes(step.id) || false,
    }));
    setSteps(updatedSteps);
    
    // Update current step
    const next = getNextStep(updatedSteps);
    setCurrentStep(next || updatedSteps[updatedSteps.length - 1]);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <div className="ml-64 flex items-center justify-center" style={{ minHeight: "100vh" }}>
          <div className="text-center">
            <p className="text-white/70 mb-4">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = calculateProgress(
    progress?.completedSteps || [],
    steps.length
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <main className="ml-64 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              <span>Back to Tasks</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{task.title}</h1>
                <p className="text-white/70">{task.micro_coaching}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-white/50">Progress</div>
                  <div className="text-2xl font-bold text-white">{progressPercentage}%</div>
                </div>
                <div className="w-20 h-20">
                  <svg className="transform -rotate-90" width="80" height="80">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#00d4ff"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 35}
                      strokeDashoffset={2 * Math.PI * 35 * (1 - progressPercentage / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Steps List */}
              <div className="bg-[#0f0f23] border border-white/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-[#00ffff]" size={20} />
                  <h2 className="text-white text-lg font-semibold">Step-by-Step Guide</h2>
                </div>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`border rounded-lg p-4 transition-all ${
                        step.completed
                          ? "border-green-500/50 bg-green-500/10"
                          : step.id === currentStep?.id
                          ? "border-[#00d4ff]/50 bg-[#00d4ff]/10"
                          : "border-white/10 bg-[#0a0a1a]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleStepToggle(step.id)}
                          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            step.completed
                              ? "border-green-500 bg-green-500"
                              : "border-white/30 hover:border-[#00d4ff]"
                          }`}
                        >
                          {step.completed && <CheckCircle2 size={16} className="text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-white">
                              Step {step.order}
                            </span>
                            {step.id === currentStep?.id && (
                              <span className="text-xs px-2 py-0.5 rounded bg-[#00d4ff]/20 text-[#00d4ff]">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/70">{step.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {task.quick_links.length > 0 && (
                <div className="bg-[#0f0f23] border border-white/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-[#00ffff]" size={20} />
                    <h2 className="text-white text-lg font-semibold">Resources</h2>
                  </div>
                  <div className="space-y-2">
                    {task.quick_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#00d4ff] hover:text-[#00ffff] transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span className="text-sm truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: AI Chat */}
            <div className="lg:col-span-1">
              <div className="sticky top-6" style={{ height: "calc(100vh - 3rem)" }}>
                <AIChat
                  taskTitle={task.title}
                  taskContext={task.micro_coaching}
                  currentStep={currentStep?.title}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

