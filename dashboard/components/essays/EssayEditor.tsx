"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Essay } from '@/lib/essays/types';
import { countWords, calculateStatus, getStatusLabel } from '@/lib/essays/utils';
import { ArrowLeft, Save, Link as LinkIcon, ChevronDown, ChevronUp, Sparkles, Upload, FileText, Copy, CheckCircle2, Circle, Clock, Keyboard, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EssayEditorProps {
  essay: Essay;
  onSave?: (updatedEssay: Essay) => void;
}

export default function EssayEditor({ essay: initialEssay, onSave }: EssayEditorProps) {
  const router = useRouter();
  const [essay, setEssay] = useState<Essay>(initialEssay);
  const [wordCount, setWordCount] = useState(essay.wordCount);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(true);
  const [isGoogleDocExpanded, setIsGoogleDocExpanded] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update word count when content changes
  useEffect(() => {
    const count = countWords(essay.content);
    setWordCount(count);
    
    // Auto-update status based on word count
    const newStatus = calculateStatus(count, essay.wordLimit);
    if (newStatus !== essay.status) {
      setEssay(prev => ({ ...prev, status: newStatus }));
    }
  }, [essay.content, essay.wordLimit, essay.status]);

  const performSave = useCallback(async (isAutoSave = false) => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    
    setIsSaving(true);
    
    // Update word count and status
    const currentContent = essay.content;
    const finalWordCount = countWords(currentContent);
    const finalStatus = calculateStatus(finalWordCount, essay.wordLimit);
    
    const updatedEssay: Essay = {
      ...essay,
      wordCount: finalWordCount,
      status: finalStatus,
      updatedAt: new Date(),
      lastEdited: new Date(),
    };

    if (onSave) {
      onSave(updatedEssay);
    } else {
      // TODO: Save to API or local storage
      console.log('Saving essay:', updatedEssay);
    }

    // Simulate save delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, [essay, onSave, isSaving]);

  // Auto-save functionality - debounced save after user stops typing
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      performSave(true); // true = auto-save
    }, 2000); // Auto-save 2 seconds after user stops typing

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [essay.content, essay.googleDocUrl, hasUnsavedChanges, performSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving) {
          performSave(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSaving, performSave]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEssay(prev => ({
      ...prev,
      content: newContent,
      updatedAt: new Date(),
      lastEdited: new Date(),
    }));
    setHasUnsavedChanges(true);
  };

  const handleGoogleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEssay(prev => ({
      ...prev,
      googleDocUrl: e.target.value,
      updatedAt: new Date(),
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = useCallback(() => {
    performSave(false); // Manual save
  }, [performSave]);

  const handleBack = () => {
    router.push('/essays');
  };

  const formatLastSaved = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const isOverLimit = wordCount > essay.wordLimit;
  const wordCountColor = isOverLimit ? 'text-red-300' : wordCount >= essay.wordLimit * 0.9 ? 'text-emerald-300' : wordCount >= essay.wordLimit * 0.8 ? 'text-amber-300' : 'text-[#b8b8b8]';
  const progressPercentage = Math.min((wordCount / essay.wordLimit) * 100, 100);
  const promptWordCount = countWords(essay.prompt);
  const paragraphs = essay.content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const copyPrompt = () => {
    navigator.clipboard.writeText(essay.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getStatusIcon = (status: typeof essay.status) => {
    switch (status) {
      case 'not_started':
        return <Circle size={14} />;
      case 'in_progress':
        return <Clock size={14} />;
      case 'complete':
        return <CheckCircle2 size={14} />;
    }
  };

  const getStatusColor = (status: typeof essay.status) => {
    switch (status) {
      case 'not_started':
        return 'text-[#999999]';
      case 'in_progress':
        return 'text-blue-400';
      case 'complete':
        return 'text-green-400';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isFocusMode ? 'opacity-50' : ''}`} style={{ background: 'linear-gradient(135deg, #2a2a2a 0%, #252525 50%, #1e1e1e 100%)' }}>
      {/* Compact Header */}
      <div className={`bg-gradient-to-r from-[#252525] via-[#252525] to-[#252525]/95 border-b border-white/8 p-6 ${isFocusMode ? 'opacity-20 hover:opacity-100 transition-opacity duration-300' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
              <button
                onClick={handleBack}
                className="text-[#999999] hover:text-[#e5e5e5] transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
                aria-label="Back to essays"
                onMouseEnter={() => setShowTooltip('Back to essays')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <ArrowLeft size={20} />
              </button>
                <h1 className="text-[#e5e5e5] text-3xl font-semibold tracking-tight">{essay.title}</h1>
              </div>
              
              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-sm text-[#b8b8b8] ml-8">
                {essay.collegeName && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-300/20 to-teal-300/20 border border-cyan-400/20 rounded-full text-[#e5e5e5]">
                    {essay.collegeName}
                  </span>
                )}
                <span className="text-[#999999]">Limit: {essay.wordLimit}</span>
                <span className={wordCountColor}>Words: {wordCount}</span>
                {hasUnsavedChanges && !isSaving && (
                  <span className="text-[#999999] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></span>
                    Unsaved
                  </span>
                )}
                {isSaving && (
                  <span className="text-cyan-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></span>
                    Saving...
                  </span>
                )}
                {lastSaved && !hasUnsavedChanges && !isSaving && (
                  <span className="text-emerald-300/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
                    Saved {formatLastSaved(lastSaved)}
                  </span>
                )}
                <span className="text-[#999999] text-xs">• Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">⌘S</kbd> to save</span>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-medium ${
                isSaving
                  ? 'bg-white/5 text-[#999999] cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-cyan-300/20 to-teal-300/20 border border-cyan-400/20 text-[#e5e5e5] hover:from-cyan-300/25 hover:to-teal-300/25 active:scale-95'
              }`}
              onMouseEnter={() => setShowTooltip('Save (⌘S)')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Prompt Bar */}
      <div className={`sticky top-0 z-10 bg-[#252525]/95 backdrop-blur-sm border-b border-white/8 ${isFocusMode ? 'opacity-20 hover:opacity-100 transition-opacity duration-300' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
              className="flex-1 flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all duration-200 ease-in-out"
            >
              <div className="flex items-center gap-2 flex-1">
                <FileText size={16} className="text-[#999999]" />
                <span className="text-sm font-medium text-[#b8b8b8]">Prompt</span>
                {isPromptExpanded && (
                  <span className="text-sm text-[#999999] line-clamp-1">{essay.prompt}</span>
                )}
                <span className="text-xs text-[#999999]">({promptWordCount} words)</span>
              </div>
              {isPromptExpanded ? (
                <ChevronUp size={18} className="text-[#999999] flex-shrink-0 transition-transform duration-200" />
              ) : (
                <ChevronDown size={18} className="text-[#999999] flex-shrink-0 transition-transform duration-200" />
              )}
            </button>
            <button
              onClick={copyPrompt}
              className="p-2 text-[#999999] hover:text-[#e5e5e5] hover:bg-white/5 rounded-lg transition-all duration-200"
              onMouseEnter={() => setShowTooltip('Copy prompt')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {copiedPrompt ? <CheckCircle2 size={18} className="text-emerald-300" /> : <Copy size={18} />}
            </button>
          </div>
          {isPromptExpanded && (
            <div className="px-4 pb-4 animate-in fade-in duration-200">
              <p className="text-sm text-[#b8b8b8] leading-relaxed">{essay.prompt}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`max-w-5xl mx-auto grid grid-cols-[1fr,250px] gap-10 mt-8 px-6 ${isFocusMode ? '[&>*:not(:first-child)]:opacity-20 [&>*:not(:first-child)]:hover:opacity-100 transition-opacity duration-300' : ''}`}>
        {/* Editor Section */}
        <div className="min-w-0">
          <div className="bg-[#2a2a2a]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-black/20 relative overflow-hidden pattern-overlay">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/5 via-transparent to-teal-300/5 pointer-events-none"></div>
            <textarea
              value={essay.content}
              onChange={handleContentChange}
              placeholder="Start writing your essay here..."
              className={`relative w-full h-[600px] bg-transparent border-0 rounded-xl px-6 py-4 text-[#e5e5e5] placeholder-[#999999] focus:outline-none transition-all duration-200 resize-none ${
                isOverLimit ? 'text-red-300' : ''
              }`}
              style={{ 
                fontFamily: 'inherit', 
                fontSize: '16px', 
                lineHeight: '1.8',
                paddingBottom: '2.5rem',
                letterSpacing: '0.01em'
              }}
            />
            
            {/* Word Count Bottom Right */}
            <div className="absolute bottom-3 right-4 text-xs text-[#999999] bg-[#2a2a2a]/70 backdrop-blur-md px-2 py-1 rounded">
              {wordCount} / {essay.wordLimit}
            </div>
            
            {/* Writing Statistics */}
            {essay.content.length > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-3 text-xs text-[#999999]">
                <span>{paragraphs} {paragraphs === 1 ? 'paragraph' : 'paragraphs'}</span>
                {readingTime > 0 && <span>• {readingTime} min read</span>}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#999999] hover:text-[#e5e5e5] hover:bg-gradient-to-r hover:from-rose-300/20 hover:to-orange-300/20 hover:border hover:border-rose-400/20 rounded-lg transition-all duration-200 ease-in-out active:scale-95"
              onMouseEnter={() => setShowTooltip('AI-powered essay refinement')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Sparkles size={16} />
              Refine
            </button>
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="px-4 py-2 text-sm text-[#999999] hover:text-[#e5e5e5] hover:bg-white/5 rounded-lg transition-all duration-200 ease-in-out active:scale-95"
              onMouseEnter={() => setShowTooltip(isFocusMode ? 'Exit focus mode' : 'Enter focus mode')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Draft Status */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-white/8 shadow-lg shadow-black/10 p-4 pattern-overlay">
            <h3 className="text-sm font-medium text-[#b8b8b8] mb-3">Draft Status</h3>
            <div className="space-y-2">
              {(['not_started', 'in_progress', 'complete'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setEssay(prev => ({ ...prev, status }))}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out ${
                    essay.status === status
                      ? 'bg-gradient-to-r from-cyan-300/15 to-teal-300/15 border border-cyan-400/20 text-[#e5e5e5]'
                      : 'text-[#b8b8b8] hover:bg-white/5 active:scale-95'
                  }`}
                  onMouseEnter={() => setShowTooltip(`Set status to ${getStatusLabel(status)}`)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <span className={getStatusColor(status)}>{getStatusIcon(status)}</span>
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/8">
              <div className="text-xs text-[#999999]">
                <div className="flex items-center justify-between mb-1">
                  <span>Progress</span>
                  <span className={wordCountColor}>{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Word Limit Progress */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-white/8 shadow-lg shadow-black/10 p-4 pattern-overlay">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#b8b8b8]">Word Limit</h3>
              <span className={`text-xs font-medium ${wordCountColor} transition-colors duration-200`}>
                {wordCount} / {essay.wordLimit}
              </span>
            </div>
            <div className="relative w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
              {/* Warning zones */}
              {progressPercentage >= 80 && progressPercentage < 90 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" style={{ width: '10%', left: '80%' }}></div>
              )}
              <div
                className={`h-full transition-all duration-500 ease-out relative ${
                  isOverLimit
                    ? 'bg-gradient-to-r from-red-400/40 to-red-500/40'
                    : progressPercentage >= 90
                    ? 'bg-gradient-to-r from-emerald-300/30 to-green-300/30'
                    : progressPercentage >= 80
                    ? 'bg-gradient-to-r from-amber-300/30 to-yellow-300/30'
                    : 'bg-gradient-to-r from-cyan-300/30 to-teal-300/30'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                {progressPercentage >= 90 && progressPercentage <= 100 && !isOverLimit && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
              </div>
            </div>
            {isOverLimit && (
              <p className="text-xs text-red-300 mt-2 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-300 rounded-full"></span>
                Over by {wordCount - essay.wordLimit} words
              </p>
            )}
            {progressPercentage >= 80 && progressPercentage < 90 && !isOverLimit && (
              <p className="text-xs text-amber-300 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></span>
                Approaching limit
              </p>
            )}
            {progressPercentage >= 90 && progressPercentage <= 100 && !isOverLimit && (
              <p className="text-xs text-emerald-300 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Within limit
              </p>
            )}
          </div>

          {/* Upload to Portal Button */}
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-300/20 to-teal-300/20 border border-cyan-400/20 hover:from-cyan-300/25 hover:to-teal-300/25 text-[#e5e5e5] rounded-xl transition-all duration-200 ease-in-out active:scale-95 text-sm font-medium"
            onMouseEnter={() => setShowTooltip('Upload essay to application portal')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Upload size={16} />
            Upload to Portal
          </button>
          
          {/* Writing Statistics Card */}
          {essay.content.length > 0 && (
            <div className="bg-[#2a2a2a] rounded-2xl border border-white/8 shadow-lg shadow-black/10 p-4 pattern-overlay">
              <h3 className="text-sm font-medium text-[#b8b8b8] mb-3">Statistics</h3>
              <div className="space-y-2 text-xs text-[#b8b8b8]">
                <div className="flex items-center justify-between">
                  <span>Paragraphs</span>
                  <span className="text-[#e5e5e5] font-medium">{paragraphs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reading time</span>
                  <span className="text-[#e5e5e5] font-medium">{readingTime} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Characters</span>
                  <span className="text-[#e5e5e5] font-medium">{essay.content.length.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Doc Link Section (Below Editor) */}
      <div className="max-w-5xl mx-auto mt-10 px-6">
        <div className="bg-[#2a2a2a]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden pattern-overlay">
          <button
            onClick={() => setIsGoogleDocExpanded(!isGoogleDocExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 ease-in-out"
          >
            <div className="flex items-center gap-2">
              <LinkIcon size={18} className="text-[#999999]" />
              <span className="text-sm font-medium text-[#b8b8b8]">Google Doc Link</span>
            </div>
            {isGoogleDocExpanded ? (
              <ChevronUp size={18} className="text-[#999999] transition-transform duration-200" />
            ) : (
              <ChevronDown size={18} className="text-[#999999] transition-transform duration-200" />
            )}
          </button>
          
          {isGoogleDocExpanded && (
            <div className="px-4 pb-4 animate-in fade-in duration-200">
              <input
                type="url"
                value={essay.googleDocUrl || ''}
                onChange={handleGoogleDocChange}
                placeholder="https://docs.google.com/document/d/..."
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-[#e5e5e5] placeholder-[#999999] focus:outline-none focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[#999999]">
                  Link your Google Doc to sync your essay content
                </p>
                {essay.googleDocUrl && (
                  <span className="text-xs text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Connected
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed z-50 px-3 py-1.5 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/15 rounded-lg shadow-lg text-xs text-[#e5e5e5] pointer-events-none animate-in fade-in duration-150"
          style={{
            left: '50%',
            top: '10%',
            transform: 'translateX(-50%)'
          }}
        >
          {showTooltip}
        </div>
      )}
    </div>
  );
}

