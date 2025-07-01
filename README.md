# Candidate-Verifier - Take Home Assignment

## Project Overview

A comprehensive web-based candidate verification system that simulates a real screening flow. The application loads candidate data, validates existing fields, asks additional configured questions, and allows users to correct, confirm, or fill missing information. The system provides a clean, structured output with verification results.

## Objective

This project demonstrates the ability to:
- Design dynamic data-driven flows
- Manage complex validation logic
- Support extensibility through configurable questions
- Create an intuitive frontend interface
- Generate structured verification reports

## Features

### Core Functionality
- **Dynamic Field Validation**: Validates candidate information with real-time feedback
- **Interactive Verification Process**: Step-by-step verification with visual progress indicators
- **Additional Questions Module**: Configurable additional questions with different field types
- **Smart Field Verification**: Simulated verification process with scoring system
- **Comprehensive Summary**: Detailed verification report with overall scoring
- **Export Functionality**: Download verification reports as JSON files
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Advanced Features
- **JSON File Upload**: Support for pre-filled candidate data via JSON upload
- **Multi-step Form Flow**: Progressive disclosure of information collection
- **Real-time Validation**: Immediate feedback on field validation errors
- **Visual Progress Tracking**: Progress bars and status indicators throughout the process
- **Professional UI/UX**: Modern, clean interface with consistent design patterns

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohamedAshiq09/candidate-verifier.git
   cd candidate-verifier
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Demo & Screenshots

### Working Demo
**Live Demo Video**: [YouTube Link](https://www.youtube.com/watch?v=90BI-0NnEtc)

[![Demo Video Thumbnail](./public/screenshots/01-data-collection-1.png)](https://www.youtube.com/watch?v=90BI-0NnEtc)

### Application Screenshots

#### 1. Initial Data Collection
![Data Collection - Form View](./public/screenshots/01-data-collection-1.png)
*Initial candidate information form interface*

![Data Collection - JSON Upload](./public/screenshots/01-data-collection-2.png)
*JSON file upload option for pre-filled data*

![Data Collection - Form Validation](./public/screenshots/01-data-collection-3.png)
*Real-time form validation and error handling*

#### 2. Field Verification Process
![Field Verification](./public/screenshots/02-field-verification.png)
*Real-time verification process with progress indicators*

#### 3. Additional Questions
![Additional Questions - Step 1](./public/screenshots/03-additional-questions-1.png)
*Step-by-step additional question collection interface*

![Additional Questions - Step 2](./public/screenshots/03-additional-questions-2.png)
*Continuation of additional questions with different field types*

#### 4. Verification Summary
![Summary Report - Overview](./public/screenshots/04-summary-report-1.png)
*Comprehensive verification report with scoring overview*

![Summary Report - Details](./public/screenshots/04-summary-report-2.png)
*Detailed verification results and export functionality*

![Summary Report - Details](./public/screenshots/04-summary-report-3.png)
*Detailed verification results and export functionality*

## Input/Output Format

### Input Format (Sample JSON Upload)
```json
{
  "sessionId": "ashiq001",
  "fields": {
    "fullName": "Ashiq",
    "preferredName": "Ash",
    "email": "ashiq@example.com",
    "phone": "+91 9876543210",
    "address": "123 Main Street, Chennai, TN, 600001",
    "experience": 3,
    "skills": "JavaScript, React, Node.js",
    "education": "B.Tech, Anna University, 2023",
    "currentCompany": "Airosphere",
    "linkedinProfile": "https://linkedin.com/in/ashiq"
  },
  "additionalQuestions": [
    {
      "id": "noticePeriod",
      "questionText": "What is your notice period?",
      "type": "text",
      "required": true
    },
    {
      "id": "preferredLocation",
      "questionText": "Which location do you prefer to work from?",
      "type": "text",
      "required": false
    }
  ]
}
```

### Output Format (Verification Result)
```json
{
  "candidate": {
    "fullName": "ashiq",
    "name": "ashiq ",
    "email": "ashiq@example.com",
    "phone": "+91 9876543210",
    "address": "123 Main Street, Chennai, TN, 600001",
    "experience": "3",
    "skills": "JavaScript, React, Node.js",
    "education": "B.Tech, Anna University, 2023",
    "currentCompany": "Airosphere",
    "linkedinUrl": ""
  },
  "verification": {
    "fieldResults": [
      {
        "fieldId": "email",
        "fieldName": "Email Address",
        "status": "success",
        "message": "Successfully verified",
        "score": 97
      },
      {
        "fieldId": "phone",
        "fieldName": "Phone Number",
        "status": "success",
        "message": "Successfully verified",
        "score": 96
      },
      {
        "fieldId": "address",
        "fieldName": "Address",
        "status": "warning",
        "message": "Partially verified - requires manual review",
        "score": 73,
        "details": "Manual review required for complete verification"
      },
      {
        "fieldId": "education",
        "fieldName": "Education",
        "status": "success",
        "message": "Successfully verified",
        "score": 95
      },
      {
        "fieldId": "experience",
        "fieldName": "Work Experience",
        "status": "success",
        "message": "Credentials confirmed",
        "score": 88
      },
      {
        "fieldId": "skills",
        "fieldName": "Skills",
        "status": "success",
        "message": "Successfully verified",
        "score": 97
      }
    ],
    "overallScore": 91,
    "status": "passed",
    "summary": "Verification completed successfully. 5 out of 6 fields verified with high confidence."
  },
  "additionalAnswers": {
    "availability": "yes ",
    "salaryExpectation": "7000000",
    "workLocation": "on-site",
    "workSchedule": "full-time",
    "motivation": "i am so exicted ",
    "additionalInfo": ""
  },
  "generatedAt": "2025-07-01T13:19:36.288Z"
}
```

## User Flow

1. **Step 1**: Upload JSON file or manually enter candidate details
2. **Step 2**: System validates each field with real-time feedback
3. **Step 3**: Automated verification process with progress tracking
4. **Step 4**: Answer additional configured questions
5. **Step 5**: Review comprehensive summary report
6. **Step 6**: Save application and download verification report

## Design Choices

### Frontend Architecture
- **Component-based Design**: Modular React components for maintainability
- **TypeScript Integration**: Type safety and better developer experience
- **Progressive Enhancement**: Step-by-step flow with clear visual feedback

### Validation Strategy
- **Client-side Validation**: Immediate feedback for better UX
- **Simulated Verification**: Realistic verification process with weighted scoring
- **Error Handling**: Comprehensive error states and user guidance
- **Data Persistence**: In-memory state management during session

### UX/UI Decisions
- **Progress Indicators**: Clear visual feedback on process completion
- **Card-based Layout**: Clean, organized information presentation
- **Color-coded Status**: Intuitive color scheme for verification results
- **Accessibility**: Proper labeling and keyboard navigation support

## Architecture

### Frontend Components
- **CandidateVerifier.tsx**: Initial data collection and validation
- **FieldVerification.tsx**: Simulated verification process with scoring
- **AdditionalQuestions.tsx**: Dynamic question collection module
- **Summary.tsx**: Final verification report and export functionality

### Technology Stack
- **Frontend**: Next.js 15 , TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **File Handling**: Browser File API for JSON upload

## File Structure

```
candidate-verifier/
│ ├── app/
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Main entry page
│ │ └── api/
│ │ ├── verify/
│ │ │ └── route.ts # API for verification
│ │ └── save/
│ │ └── route.ts # API for saving data
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ └── progress.tsx
│ │ ├── CandidateVerifier.tsx
│ │ ├── FieldVerification.tsx
│ │ ├── AdditionalQuestions.tsx
│ │ └── Summary.tsx
│ ├── lib/
│ │ ├── utils.ts # Helper functions
│ │ └── validators.ts # Validation logic
│ └── types/
│ └── index.ts # Type definitions
```

## Validation Rules

| Field Type | Validation Rule |
|------------|----------------|
| **text** | Minimum 2 characters |
| **email** | Valid email regex pattern |
| **tel** | Valid phone number format |
| **number** | Integer or float, with min/max bounds |
| **url** | Valid URL format |
| **required** | Non-empty field validation |

## Testing

### Manual Testing Scenarios
- Valid candidate data submission
- Invalid email/phone format handling
- Required field validation
- JSON file upload functionality
- Progress tracking accuracy
- Summary report generation
- Export functionality
- Mobile responsiveness

### Edge Cases Handled
- Empty form submissions
- Invalid JSON file formats
- Network simulation delays
- Large text input handling
- Special characters in names/addresses