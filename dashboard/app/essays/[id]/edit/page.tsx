"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EssayEditor from '@/components/essays/EssayEditor';
import { useEssays } from '@/contexts/EssayContext';
import { Essay } from '@/lib/essays/types';

export default function EditEssayPage() {
  const params = useParams();
  const router = useRouter();
  const { getEssay, editEssay } = useEssays();
  const essayId = params.id as string;
  
  const essay = getEssay(essayId);

  // Redirect if essay not found
  useEffect(() => {
    if (!essay && essayId) {
      router.push('/essays');
    }
  }, [essay, essayId, router]);

  if (!essay) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <Sidebar />
        <div className="ml-64 flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="text-center">
            <p className="text-white/70 mb-4">Essay not found</p>
            <button
              onClick={() => router.push('/essays')}
              className="text-[#00ffff] hover:text-[#00d4ff] transition-colors"
            >
              Back to Essays
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (updatedEssay: Essay) => {
    const result = editEssay(essayId, updatedEssay);
    if (result) {
      // Successfully saved
      console.log('Essay saved:', result);
      // Optionally redirect back to essays list
      // router.push('/essays');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <div className="ml-64 overflow-y-auto" style={{ minHeight: '100vh' }}>
        <EssayEditor essay={essay} onSave={handleSave} />
      </div>
    </div>
  );
}

