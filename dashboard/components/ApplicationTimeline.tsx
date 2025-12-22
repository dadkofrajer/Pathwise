"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Clock, XCircle, FileText, GraduationCap, Send } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  college: string;
  status: "completed" | "pending" | "upcoming" | "overdue";
  type: "application" | "deadline" | "decision" | "essay";
  description?: string;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2024-11-01",
    college: "Harvard University",
    status: "completed",
    type: "application",
    description: "Common App submitted"
  },
  {
    id: "2",
    date: "2024-11-15",
    college: "MIT",
    status: "pending",
    type: "deadline",
    description: "Early Action deadline"
  },
  {
    id: "3",
    date: "2024-12-01",
    college: "Stanford University",
    status: "upcoming",
    type: "essay",
    description: "Supplemental essays due"
  },
  {
    id: "4",
    date: "2024-12-15",
    college: "Yale University",
    status: "upcoming",
    type: "deadline",
    description: "Regular Decision deadline"
  },
  {
    id: "5",
    date: "2024-10-20",
    college: "Princeton University",
    status: "overdue",
    type: "essay",
    description: "Supplemental essay overdue"
  },
];

const getStatusIcon = (status: TimelineEvent["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={16} className="text-[#00ffff]" />;
    case "pending":
      return <Clock size={16} className="text-[#00d4ff]" />;
    case "upcoming":
      return <Calendar size={16} className="text-white/50" />;
    case "overdue":
      return <XCircle size={16} className="text-[#ff00ff]" />;
  }
};

const getStatusColor = (status: TimelineEvent["status"]) => {
  switch (status) {
    case "completed":
      return "border-[#00ffff] bg-[#00ffff]/10";
    case "pending":
      return "border-[#00d4ff] bg-[#00d4ff]/10";
    case "upcoming":
      return "border-white/20 bg-white/5";
    case "overdue":
      return "border-[#ff00ff] bg-[#ff00ff]/10";
  }
};

const getTypeIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "application":
      return <Send size={14} className="text-white/70" />;
    case "deadline":
      return <Calendar size={14} className="text-white/70" />;
    case "decision":
      return <GraduationCap size={14} className="text-white/70" />;
    case "essay":
      return <FileText size={14} className="text-white/70" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ApplicationTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Sort events by date
  const sortedEvents = [...mockTimelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="bg-[#0f0f23] border border-white/20 rounded-md p-6 overflow-visible">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Application Timeline</h2>
        <div className="flex items-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#00ffff]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#00d4ff]" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-white/50" />
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-[#ff00ff]" />
            <span>Overdue</span>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-white/10"></div>

        {/* Timeline Events */}
        <div className="relative flex items-start gap-8 overflow-x-auto pb-4 overflow-y-visible">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer group pt-4"
              onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
            >
              {/* Event Dot */}
              <div className={`relative z-20 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getStatusColor(event.status)} ${
                selectedEvent === event.id ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                {getStatusIcon(event.status)}
              </div>

              {/* Event Info */}
              <div className={`mt-3 text-center transition-all duration-200 ${
                selectedEvent === event.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
              }`}>
                <div className="text-xs text-white/50 mb-1">{formatDate(event.date)}</div>
                <div className="text-sm font-semibold text-white mb-1">{event.college}</div>
                <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                  {getTypeIcon(event.type)}
                  <span className="capitalize">{event.type}</span>
                </div>
                {selectedEvent === event.id && event.description && (
                  <div className="mt-2 text-xs text-white/70 bg-[#0a0a1a] border border-white/20 rounded-md px-2 py-1 max-w-[200px]">
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

