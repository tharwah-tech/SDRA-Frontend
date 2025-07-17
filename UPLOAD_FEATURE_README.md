# RAG Document Upload Feature

## Overview
This feature allows users to upload reference documents for RAG (Retrieval-Augmented Generation) agents. The implementation includes file selection, progress tracking, validation, and backend integration.

## Features Implemented

### 1. File Selection
- Hidden file input that opens when the upload button is clicked
- Supports multiple file types: PDF, DOC, DOCX, TXT, RTF, MD
- File type validation with user-friendly error messages

### 2. File Validation
- **File Size**: Maximum 10MB limit
- **File Type**: Only allows supported document formats
- **User Feedback**: Clear error messages for validation failures

### 3. Upload Progress
- Real-time progress bar showing upload percentage
- Visual feedback with progress animation
- Cancel upload functionality
- Upload status display

### 4. Backend Integration
- Uses existing RAG repository pattern
- FormData upload to backend API
- Proper error handling and success feedback
- Automatic document list refresh after successful upload

### 5. User Experience
- Disabled upload button during upload process
- Progress section with file name display
- Cancel button for ongoing uploads
- Success/error notifications using toastr
- File type icons in the documents table

## Technical Implementation

### Component Structure
- **File**: `rag-reference-documents-card.component.ts`
- **Template**: `rag-reference-documents-card.component.html`
- **Styles**: `rag-reference-documents-card.component.scss`

### Key Methods
- `uploadDocument()`: Triggers file selection
- `handleFileSelection()`: Validates and processes selected file
- `startUpload()`: Initiates upload with progress tracking
- `cancelUpload()`: Cancels ongoing upload
- `getFileIcon()`: Returns appropriate icon for file type

### State Management
- Uses NgRx store for upload actions
- Integrates with existing RAG effects and actions
- Proper error handling and success feedback

### API Integration
- **Endpoint**: `POST /agents_lab/rag/documents/upload/`
- **Payload**: FormData with file and agent_id
- **Response**: RagDocumentEntity

## Usage

1. Click the "Upload Document" button
2. Select a file from your machine
3. File will be validated automatically
4. Upload progress will be displayed
5. Success/error message will be shown
6. Document list will refresh automatically

## File Type Support
- **PDF**: `application/pdf`
- **DOC**: `application/msword`
- **DOCX**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **TXT**: `text/plain`
- **RTF**: `text/rtf`
- **MD**: `text/markdown`

## Error Handling
- File size validation (max 10MB)
- File type validation
- Network error handling
- Backend error response handling
- User-friendly error messages

## Styling
- Responsive design with Tailwind CSS
- Material Design components
- Progress bar with smooth animations
- File type icons for better UX
- Hover effects and transitions

## Translation Support
- English and Arabic translations
- Dynamic translation keys
- Proper i18n integration

## Future Enhancements
- Drag and drop file upload
- Multiple file upload
- File preview before upload
- Upload resume functionality
- Better progress tracking with actual upload progress 
