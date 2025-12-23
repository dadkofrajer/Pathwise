"use client";

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Essay } from '@/lib/essays/types';

interface CreateEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (essayData: Omit<Essay, 'id' | 'wordCount' | 'status' | 'createdAt' | 'updatedAt' | 'lastEdited'>) => void;
  collegeId?: string;
  collegeName?: string;
}

export default function CreateEssayModal({ isOpen, onClose, onSubmit, collegeId, collegeName }: CreateEssayModalProps) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [wordLimit, setWordLimit] = useState(650);
  const [content, setContent] = useState('');
  const [googleDocUrl, setGoogleDocUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !prompt.trim()) {
      alert('Please fill in the title and prompt fields.');
      return;
    }

    onSubmit({
      title: title.trim(),
      prompt: prompt.trim(),
      content: content.trim(),
      wordLimit: Number(wordLimit) || 650,
      collegeId: collegeId,
      collegeName: collegeName,
      googleDocUrl: googleDocUrl.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setPrompt('');
    setWordLimit(650);
    setContent('');
    setGoogleDocUrl('');
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setTitle('');
    setPrompt('');
    setWordLimit(650);
    setContent('');
    setGoogleDocUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-[#2a2a2a]/30 backdrop-blur-2xl border border-white/10 rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-white text-xl font-bold">
            {collegeName ? `Add Essay for ${collegeName}` : 'Create New Essay'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-[#2a2a2a]/40 backdrop-blur-sm p-1.5 rounded-md transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
              Essay Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Common Application Essay"
              className="w-full bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff]/50 transition-all duration-200"
              required
            />
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-semibold text-white mb-2">
              Essay Prompt *
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the essay prompt or question..."
              rows={4}
              className="w-full bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff]/50 transition-all duration-200 resize-none"
              required
            />
          </div>

          {/* Word Limit */}
          <div>
            <label htmlFor="wordLimit" className="block text-sm font-semibold text-white mb-2">
              Word Limit
            </label>
            <input
              type="number"
              id="wordLimit"
              value={wordLimit}
              onChange={(e) => setWordLimit(Number(e.target.value) || 650)}
              min="1"
              className="w-full bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff]/50 transition-all duration-200"
            />
          </div>

          {/* Google Doc URL */}
          <div>
            <label htmlFor="googleDocUrl" className="block text-sm font-semibold text-white mb-2">
              Google Doc URL (Optional)
            </label>
            <input
              type="url"
              id="googleDocUrl"
              value={googleDocUrl}
              onChange={(e) => setGoogleDocUrl(e.target.value)}
              placeholder="https://docs.google.com/document/d/..."
              className="w-full bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff]/50 transition-all duration-200"
            />
          </div>

          {/* Initial Content (Optional) */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
              Initial Content (Optional)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your essay here (optional)..."
              rows={6}
              className="w-full bg-[#2a2a2a]/40 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff]/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-[#2a2a2a]/40 backdrop-blur-sm rounded-md transition-all duration-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#2a2a2a]/40 backdrop-blur-sm border border-[#00ffff]/50 text-[#00ffff] px-4 py-2 rounded-md hover:bg-[#00ffff]/10 transition-all duration-200 text-sm font-medium"
            >
              <Plus size={16} />
              Create Essay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

