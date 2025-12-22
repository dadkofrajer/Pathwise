# Document Library - Implementation Plan

## Overview
A secure document management system for storing, organizing, and managing all application-related documents including transcripts, test scores, certificates, awards, and other supporting materials.

## Goals
- Centralized storage for all application documents
- Organization by category, school, and application
- Version control for document updates
- Secure access with expiration dates
- Easy retrieval and sharing

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class DocumentType(str, Enum):
    TRANSCRIPT = "transcript"
    TEST_SCORE = "test_score"
    CERTIFICATE = "certificate"
    AWARD = "award"
    PORTFOLIO_PIECE = "portfolio_piece"
    RECOMMENDATION_LETTER = "recommendation_letter"
    ESSAY = "essay"
    FINANCIAL_DOCUMENT = "financial_document"
    OTHER = "other"

class DocumentStatus(str, Enum):
    DRAFT = "draft"
    FINAL = "final"
    ARCHIVED = "archived"

class Document(BaseModel):
    id: str
    student_id: str
    name: str
    description: Optional[str] = None
    document_type: DocumentType
    file_path: str  # Storage path
    file_size: int  # Bytes
    mime_type: str  # e.g., "application/pdf"
    tags: list[str] = Field(default_factory=list)
    school_ids: list[str] = Field(default_factory=list)  # Which schools use this
    application_ids: list[str] = Field(default_factory=list)  # Which applications use this
    version: int = 1
    is_current: bool = True
    status: DocumentStatus
    uploaded_date: str
    expires_date: Optional[str] = None  # For temporary documents
    created_at: str
    updated_at: str

class DocumentVersion(BaseModel):
    id: str
    document_id: str
    version: int
    file_path: str
    uploaded_date: str
    notes: Optional[str] = None
```

#### Storage Strategy
```python
# backend/src/portfolio/storage.py

# Option 1: Local file storage (development)
STORAGE_BASE_PATH = "uploads/documents/{student_id}"

# Option 2: Cloud storage (production)
# AWS S3, Google Cloud Storage, or Azure Blob Storage

def upload_document(
    student_id: str,
    file: UploadFile,
    metadata: DocumentMetadata
) -> Document:
    """Upload and store a document"""
    # Generate unique filename
    # Store file
    # Create database record
    # Return document object
    pass

def get_document_path(document_id: str) -> str:
    """Get file path for document"""
    pass

def delete_document(document_id: str) -> bool:
    """Delete document and all versions"""
    pass

def create_version(document_id: str, file: UploadFile) -> DocumentVersion:
    """Create new version of existing document"""
    pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    student_id: str = Form(...),
    document_type: DocumentType = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),  # JSON array
    school_ids: Optional[str] = Form(None),  # JSON array
):
    """Upload a new document"""
    pass

@router.get("/documents/{student_id}", response_model=list[Document])
async def get_documents(
    student_id: str,
    document_type: Optional[DocumentType] = None,
    school_id: Optional[str] = None,
    tag: Optional[str] = None,
):
    """Get documents with optional filtering"""
    pass

@router.get("/documents/{document_id}/download")
async def download_document(document_id: str):
    """Download a document file"""
    pass

@router.get("/documents/{document_id}/preview")
async def preview_document(document_id: str):
    """Get document preview (for images/PDFs)"""
    pass

@router.patch("/documents/{document_id}", response_model=Document)
async def update_document(
    document_id: str,
    updates: UpdateDocumentRequest
):
    """Update document metadata"""
    pass

@router.post("/documents/{document_id}/version")
async def upload_new_version(
    document_id: str,
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None),
):
    """Upload new version of existing document"""
    pass

@router.get("/documents/{document_id}/versions", response_model=list[DocumentVersion])
async def get_document_versions(document_id: str):
    """Get all versions of a document"""
    pass

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    pass

@router.post("/documents/{document_id}/share")
async def create_share_link(document_id: str, expires_hours: int = 24):
    """Create temporary shareable link"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/documents/
├── DocumentLibrary.tsx              # Main component
├── DocumentCard.tsx                 # Document card with preview
├── DocumentUpload.tsx               # Upload component
├── DocumentPreview.tsx             # Preview modal/viewer
├── DocumentVersionHistory.tsx      # Version timeline
├── DocumentTags.tsx                # Tag management
├── DocumentFilters.tsx             # Filter sidebar
└── ShareDocumentModal.tsx          # Share link generator
```

#### TypeScript Types
```typescript
// dashboard/lib/documents/types.ts

export type DocumentType = 
  | "transcript" 
  | "test_score" 
  | "certificate" 
  | "award" 
  | "portfolio_piece" 
  | "recommendation_letter" 
  | "essay" 
  | "financial_document" 
  | "other";

export type DocumentStatus = "draft" | "final" | "archived";

export interface Document {
  id: string;
  studentId: string;
  name: string;
  description?: string;
  documentType: DocumentType;
  filePath: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  schoolIds: string[];
  applicationIds: string[];
  version: number;
  isCurrent: boolean;
  status: DocumentStatus;
  uploadedDate: string;
  expiresDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  filePath: string;
  uploadedDate: string;
  notes?: string;
}
```

#### Service Layer
```typescript
// dashboard/lib/documents/documentService.ts

export async function uploadDocument(
  file: File,
  metadata: {
    studentId: string;
    documentType: DocumentType;
    description?: string;
    tags?: string[];
    schoolIds?: string[];
  }
): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("student_id", metadata.studentId);
  formData.append("document_type", metadata.documentType);
  if (metadata.description) {
    formData.append("description", metadata.description);
  }
  if (metadata.tags) {
    formData.append("tags", JSON.stringify(metadata.tags));
  }
  if (metadata.schoolIds) {
    formData.append("school_ids", JSON.stringify(metadata.schoolIds));
  }

  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function getDocuments(
  studentId: string,
  filters?: {
    documentType?: DocumentType;
    schoolId?: string;
    tag?: string;
  }
): Promise<Document[]> {
  const params = new URLSearchParams({ student_id: studentId });
  if (filters?.documentType) {
    params.append("document_type", filters.documentType);
  }
  if (filters?.schoolId) {
    params.append("school_id", filters.schoolId);
  }
  if (filters?.tag) {
    params.append("tag", filters.tag);
  }

  const response = await fetch(`/api/documents/${studentId}?${params}`);
  return response.json();
}

export async function downloadDocument(documentId: string): Promise<Blob> {
  const response = await fetch(`/api/documents/${documentId}/download`);
  return response.blob();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
```

#### New Page
```typescript
// dashboard/app/documents/page.tsx
// Main document library page with:
// - Grid/list view of documents
// - Upload area (drag-and-drop)
// - Filter by type, school, tag
// - Search functionality
// - Preview on click
// - Version history
```

### Implementation Steps

1. **Phase 1: Backend Foundation (Week 1)**
   - Design storage strategy (local for dev, cloud for prod)
   - Add database models
   - Implement file upload endpoint
   - Create storage service layer
   - Add file validation (size, type)

2. **Phase 2: Basic Upload & Storage (Week 2)**
   - Build upload API endpoint
   - Implement file storage
   - Create document metadata storage
   - Add download endpoint
   - Write tests for upload/download

3. **Phase 3: Frontend Upload (Week 3)**
   - Create DocumentUpload component
   - Implement drag-and-drop
   - Add file type validation
   - Build upload progress indicator
   - Create DocumentCard component

4. **Phase 4: Document Management (Week 4)**
   - Build DocumentLibrary main component
   - Implement filtering and search
   - Add document preview
   - Create tag management
   - Build document editing (metadata)

5. **Phase 5: Version Control (Week 5)**
   - Implement version tracking
   - Build version history UI
   - Add version comparison
   - Create version upload flow

6. **Phase 6: Integration & Security (Week 6)**
   - Add expiration dates
   - Implement share links
   - Connect with applications
   - Add security checks
   - Polish UI/UX

### Dependencies

**Backend:**
- `python-multipart` (for file uploads) - already in FastAPI
- `Pillow` (for image processing/previews)
- `boto3` (if using AWS S3)
- `python-magic` (for file type detection)

**Frontend:**
- `react-dropzone` (for drag-and-drop uploads)
- `react-pdf` (for PDF previews)
- `file-saver` (for downloads)

### Storage Options

**Development:**
- Local file system storage
- Path: `uploads/documents/{student_id}/{document_id}.{ext}`

**Production:**
- AWS S3 (recommended)
- Google Cloud Storage
- Azure Blob Storage
- Consider CDN for faster access

### Security Considerations

- File type validation (whitelist allowed types)
- File size limits (e.g., 10MB max)
- Virus scanning (optional but recommended)
- Access control (students can only access their own documents)
- Secure file paths (prevent directory traversal)
- Expiration dates for temporary documents
- Share links with expiration
- Encryption at rest (if storing sensitive data)

### Testing Considerations

**Backend Tests:**
- Test file upload with various file types
- Test file size limits
- Test invalid file types (should be rejected)
- Test document metadata updates
- Test version creation
- Test file deletion
- Test access control

**Frontend Tests:**
- Test drag-and-drop upload
- Test file selection
- Test upload progress
- Test document preview
- Test filtering and search
- Test version history

### UI/UX Considerations

- Drag-and-drop upload area
- File type icons
- Preview thumbnails for images/PDFs
- Progress indicators during upload
- File size display
- Upload date and version number
- Tag chips with colors
- Quick filters sidebar
- Search bar with autocomplete
- Grid/list view toggle
- Bulk operations (select multiple, delete, tag)

### File Type Support

**Supported Types:**
- PDF (.pdf)
- Images (.jpg, .jpeg, .png, .gif)
- Word documents (.doc, .docx)
- Text files (.txt)
- Spreadsheets (.xls, .xlsx) - optional

**Preview Support:**
- PDF: Full preview
- Images: Thumbnail + full view
- Others: Download only

### Future Enhancements

- OCR for scanned documents
- Document annotation/highlighting
- Bulk upload (zip file extraction)
- Document templates
- Auto-tagging based on content
- Integration with cloud storage (Google Drive, Dropbox)
- Document sharing with counselors
- Document expiration reminders
- Document analytics (which documents are used most)

