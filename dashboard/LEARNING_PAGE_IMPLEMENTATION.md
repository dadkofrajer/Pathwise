# Learning Page Implementation Plan

## Overview
Create an interactive learning page that guides users step-by-step through completing portfolio improvement tasks with AI assistance.

## Architecture Options

### Option 1: Server-Side AI (Recommended for Production)
**Pros:**
- Secure API key management
- Better rate limiting
- Can cache responses
- More control over costs

**Cons:**
- Requires backend API endpoint
- Slightly more complex setup

**Implementation:**
- Create Next.js API route: `/app/api/ai/chat/route.ts`
- Use OpenAI SDK on server
- Frontend calls API route

### Option 2: Client-Side AI (Quick Start)
**Pros:**
- Faster to implement
- No backend changes needed
- Direct integration

**Cons:**
- API keys exposed (use environment variables)
- Less secure
- Harder to manage costs

**Implementation:**
- Use OpenAI SDK directly in client component
- Store API key in `.env.local`

### Option 3: Hybrid Approach (Best Balance)
**Pros:**
- AI guidance via backend API
- Progress tracking in frontend
- Flexible and scalable

**Implementation:**
- Backend API for AI chat
- Frontend for UI and progress tracking
- LocalStorage/Context for state management

## Recommended Implementation Structure

```
dashboard/
├── app/
│   ├── learning/
│   │   └── [taskId]/
│   │       └── page.tsx          # Main learning page
│   └── api/
│       └── ai/
│           └── chat/
│               └── route.ts       # AI chat API endpoint
├── components/
│   ├── learning/
│   │   ├── TaskProgress.tsx      # Progress tracker
│   │   ├── StepGuide.tsx          # Step-by-step guide
│   │   ├── ResourcePanel.tsx     # Resources sidebar
│   │   ├── AIChat.tsx             # AI chat interface
│   │   └── StepCard.tsx           # Individual step card
│   └── TaskManager.tsx            # Update to add navigation
├── lib/
│   ├── learning/
│   │   ├── taskService.ts         # Task data management
│   │   ├── progressService.ts     # Progress tracking
│   │   └── aiService.ts           # AI integration
│   └── portfolio/
│       └── types.ts               # Add Task type with ID
└── contexts/
    └── LearningContext.tsx        # Learning state management
```

## Key Features to Implement

### 1. Task Identification & Routing
- Generate unique IDs for tasks
- Create dynamic route: `/learning/[taskId]`
- Pass task data via URL params or context

### 2. Step-by-Step Guide
- Break down "definition_of_done" into actionable steps
- Show progress (completed/in-progress/not-started)
- Allow users to mark steps as complete
- Visual progress indicator

### 3. Resources Panel
- Display quick_links from task data
- Add curated resources per task type
- Searchable resource library
- Bookmarking functionality

### 4. AI Chat Integration
- Context-aware AI assistant
- Task-specific guidance
- Answer questions about the task
- Provide tips and troubleshooting
- Remember conversation context

### 5. Progress Tracking
- Save progress to localStorage/backend
- Track completion percentage
- Show time spent
- Completion certificates/badges

## AI Integration Options

### Option A: OpenAI GPT-4/GPT-3.5
**Setup:**
```bash
npm install openai
```

**Usage:**
- Use `gpt-4` or `gpt-3.5-turbo` models
- Create system prompt with task context
- Stream responses for better UX

**Cost:** ~$0.01-0.03 per conversation

### Option B: Anthropic Claude
**Setup:**
```bash
npm install @anthropic-ai/sdk
```

**Usage:**
- Better for long conversations
- More context window
- Good reasoning capabilities

**Cost:** Similar to OpenAI

### Option C: Open Source (Local)
**Setup:**
- Use Ollama or similar
- Run locally or on your server
- No API costs

**Pros:** Free, private
**Cons:** Requires setup, may be slower

## Data Flow

1. **User clicks task** → Navigate to `/learning/[taskId]`
2. **Page loads** → Fetch task data, load progress
3. **User interacts** → Update progress, ask AI questions
4. **Progress saved** → localStorage or backend API
5. **Completion** → Update portfolio analysis, show success

## UI/UX Considerations

### Layout
- Left sidebar: Steps & Progress
- Center: Current step details
- Right sidebar: Resources & AI Chat
- Top: Task overview with progress circle

### Interactions
- Click step to expand details
- Checkbox to mark complete
- AI chat always accessible
- Resources expandable/collapsible

### Visual Feedback
- Progress bars
- Completion animations
- Step status indicators
- AI typing indicators

## Implementation Steps

### Phase 1: Basic Structure
1. Create task ID generation
2. Set up routing (`/learning/[taskId]`)
3. Create basic page layout
4. Display task information

### Phase 2: Step-by-Step Guide
1. Parse definition_of_done into steps
2. Create step components
3. Add progress tracking
4. Implement step completion

### Phase 3: Resources
1. Display quick_links
2. Add resource panel
3. Implement search/filter
4. Add bookmarking

### Phase 4: AI Integration
1. Set up API route or client integration
2. Create chat interface
3. Add context to AI prompts
4. Implement streaming responses

### Phase 5: Polish
1. Add animations
2. Improve UX
3. Add completion celebrations
4. Implement analytics

## Example AI Prompt Structure

```
You are a helpful mentor guiding a student through completing a portfolio task.

Task: {task.title}
Description: {task.micro_coaching}
Steps: {task.definition_of_done}

Current Step: {currentStep}
User Progress: {completedSteps}/{totalSteps}

Provide guidance, answer questions, and help the student succeed.
Be encouraging, specific, and actionable.
```

## Security Considerations

1. **API Keys**: Never expose in client code
2. **Rate Limiting**: Implement on backend
3. **Input Validation**: Sanitize user inputs
4. **Cost Controls**: Set usage limits
5. **Error Handling**: Graceful degradation

## Next Steps

1. Choose AI provider (OpenAI recommended for start)
2. Set up API keys in environment variables
3. Create basic learning page structure
4. Implement step-by-step guide
5. Add AI chat interface
6. Test and iterate

