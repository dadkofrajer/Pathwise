"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import GeneralEssaySection from "@/components/essays/GeneralEssaySection";
import CollegeEssaySection from "@/components/essays/CollegeEssaySection";
import CreateEssayModal from "@/components/essays/CreateEssayModal";
import DeleteConfirmDialog from "@/components/essays/DeleteConfirmDialog";
import { useEssays } from "@/contexts/EssayContext";
import { Building2 } from "lucide-react";
import { Essay } from "@/lib/essays/types";

export default function EssaysPage() {
  const router = useRouter();
  const { generalEssays, collegeEssays, removeEssay, addEssay, getEssay, isLoading } = useEssays();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [essayToDelete, setEssayToDelete] = useState<Essay | null>(null);
  const [createModalCollege, setCreateModalCollege] = useState<{ id: string; name: string } | null>(null);

  const handleEdit = (id: string) => {
    router.push(`/essays/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    const essay = getEssay(id);
    if (essay) {
      setEssayToDelete(essay);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (essayToDelete) {
      const success = removeEssay(essayToDelete.id);
      if (success) {
        setEssayToDelete(null);
      }
    }
  };

  const handleAddGeneral = () => {
    setCreateModalCollege(null);
    setIsCreateModalOpen(true);
  };

  const handleAddCollege = (collegeId: string) => {
    const college = collegeEssays.find(c => c.id === collegeId);
    if (college) {
      setCreateModalCollege({ id: college.id, name: college.name });
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateEssay = (essayData: Omit<Essay, 'id' | 'wordCount' | 'status' | 'createdAt' | 'updatedAt' | 'lastEdited'>) => {
    addEssay(essayData);
    setIsCreateModalOpen(false);
    setCreateModalCollege(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-white/50">Loading essays...</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <main className="ml-64 overflow-y-auto">
          {/* Top Navigation Header */}
          <header className="border-b border-white/10 bg-[#2a2a2a]/30 backdrop-blur-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Essay Repository</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md">
                  <span className="text-sm text-white font-medium">
                    {generalEssays.length + collegeEssays.reduce((sum, c) => sum + c.essays.length, 0)} essays
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">

          {/* General Essays Section */}
          <GeneralEssaySection
            essays={generalEssays}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAddGeneral}
          />

            {/* College-Specific Essays Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 size={20} className="text-[#00ffff]" />
                <h2 className="text-white text-xl font-bold">College-Specific Essays</h2>
              </div>

              {collegeEssays.length === 0 ? (
                <div className="bg-[#2a2a2a]/30 backdrop-blur-xl border border-white/10 rounded-md p-12 text-center">
                  <div className="inline-flex p-4 bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md mb-4">
                    <Building2 size={32} className="text-white/50" />
                  </div>
                  <p className="text-white/70 mb-2">No college-specific essays yet.</p>
                  <p className="text-sm text-white/50">Click "Add Essay" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collegeEssays.map((college) => (
                    <CollegeEssaySection
                      key={college.id}
                      college={college}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAdd={handleAddCollege}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateEssayModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateModalCollege(null);
        }}
        onSubmit={handleCreateEssay}
        collegeId={createModalCollege?.id}
        collegeName={createModalCollege?.name}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setEssayToDelete(null);
        }}
        onConfirm={confirmDelete}
        essay={essayToDelete}
      />
    </>
  );
}

