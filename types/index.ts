export interface CandidateData {
  fullName: string
  email: string
  phone: string
  experience: number
  skills: string
  education: string
  currentCompany?: string
  linkedinUrl?: string
}

export interface FieldConfig {
  id: keyof CandidateData
  label: string
  type: string
  required: boolean
  validation?: string
  placeholder?: string
  min?: number
  max?: number
  options?: string[]
}

export interface AdditionalQuestion {
  id: string
  question: string
  type: 'select' | 'radio' | 'textarea' | 'text'
  options?: string[]
  required: boolean
  maxLength?: number
}

export interface AdditionalAnswers {
  [key: string]: string
}

export interface VerificationResult {
  fieldResults: FieldVerificationResult[]
  overallScore: number
  status: 'passed' | 'warning' | 'failed'
  summary: string
}

export interface FieldVerificationResult {
  fieldId: string
  fieldName: string
  status: 'success' | 'warning' | 'error' | 'loading'
  message: string
  details?: string
  score: number
}

export interface VerificationRules {
  email: {
    checkDomain: boolean
    allowedDomains: string[]
    blockTempEmail: boolean
  }
  skills: {
    requiredSkills: string[]
    bonusSkills: string[]
  }
  experience: {
    minimumYears: number
  }
}

export interface InputData {
  candidateFields: FieldConfig[]
  additionalQuestions: AdditionalQuestion[]
  verificationRules: VerificationRules
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SavedApplication {
  id: string
  candidateData: CandidateData
  verificationResult: VerificationResult
  additionalAnswers: AdditionalAnswers
  timestamp: string
  status: string
}