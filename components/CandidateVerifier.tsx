'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CandidateData, FieldConfig } from '@/types'
import { Upload, User, FileText, Loader2 } from 'lucide-react'

interface CandidateVerifierProps {
  onSubmit: (data: CandidateData) => void
  isLoading?: boolean
}

const defaultFields: FieldConfig[] = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name'
  },
  {
    id: 'name',
    label: 'Preferred Name',
    type: 'text',
    required: true,
    placeholder: 'Name you prefer to be called'
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'your.email@example.com'
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    placeholder: '+1 (555) 123-4567'
  },
  {
    id: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    placeholder: 'Complete address including city, state, zip'
  },
  {
    id: 'experience',
    label: 'Years of Experience',
    type: 'number',
    required: true,
    placeholder: 'Number of years',
    min: 0,
    max: 50
  },
  {
    id: 'skills',
    label: 'Technical Skills',
    type: 'text',
    required: true,
    placeholder: 'JavaScript, React, Node.js, etc. (comma separated)'
  },
  {
    id: 'education',
    label: 'Education',
    type: 'text',
    required: true,
    placeholder: 'Degree, Institution, Year'
  },
  {
    id: 'currentCompany',
    label: 'Current Company',
    type: 'text',
    required: false,
    placeholder: 'Current or most recent employer'
  },
  {
    id: 'linkedinUrl',
    label: 'LinkedIn Profile',
    type: 'url',
    required: false,
    placeholder: 'https://linkedin.com/in/yourprofile'
  }
]

export default function CandidateVerifier({ onSubmit, isLoading = false }: CandidateVerifierProps) {
  const [candidateData, setCandidateData] = useState<CandidateData>({
    fullName: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    skills: '',
    education: '',
    currentCompany: '',
    linkedinUrl: ''
  })

  const [errors, setErrors] = useState<Partial<CandidateData>>({})
  const [showJSONUpload, setShowJSONUpload] = useState(false)

  const handleInputChange = (field: keyof CandidateData, value: string) => {
    setCandidateData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CandidateData> = {}

    defaultFields.forEach(field => {
      const value = candidateData[field.id]
      const stringValue = String(value || '').trim()

      if (field.required && !stringValue) {
        newErrors[field.id] = `${field.label} is required`
        return
      }

      if (stringValue) {
        if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(stringValue)) {
            newErrors[field.id] = 'Please enter a valid email address'
          }
        }

        if (field.type === 'tel') {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
          if (!phoneRegex.test(stringValue.replace(/\s|-|\(|\)/g, ''))) {
            newErrors[field.id] = 'Please enter a valid phone number'
          }
        }

        if (field.type === 'number') {
          const num = parseInt(stringValue)
          if (isNaN(num)) {
            newErrors[field.id] = 'Please enter a valid number'
          } else if (field.min !== undefined && num < field.min) {
            newErrors[field.id] = `Must be at least ${field.min}`
          } else if (field.max !== undefined && num > field.max) {
            newErrors[field.id] = `Must be at most ${field.max}`
          }
        }

        if (field.type === 'url' && stringValue) {
          try {
            new URL(stringValue)
          } catch {
            newErrors[field.id] = 'Please enter a valid URL'
          }
        }

        if (field.type === 'text' && stringValue.length < 2) {
          newErrors[field.id] = `${field.label} must be at least 2 characters`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(candidateData)
    }
  }

  const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          if (jsonData.fields) {
            setCandidateData(prev => ({
              ...prev,
              fullName: String(jsonData.fields.name || ''),
              name: String(jsonData.fields.name || ''),
              email: String(jsonData.fields.email || ''),
              phone: String(jsonData.fields.phone || ''),
              skills: String(jsonData.fields.skills || ''),
              experience: String(jsonData.fields.experience || ''),
              education: String(jsonData.fields.education || ''),
              address: String(jsonData.fields.address || ''),
              currentCompany: String(jsonData.fields.currentCompany || ''),
              linkedinUrl: String(jsonData.fields.linkedinUrl || '')
            }))
          } else {
            setCandidateData(prev => ({
              ...prev,
              fullName: String(jsonData.fullName || ''),
              name: String(jsonData.name || ''),
              email: String(jsonData.email || ''),
              phone: String(jsonData.phone || ''),
              address: String(jsonData.address || ''),
              experience: String(jsonData.experience || ''),
              skills: String(jsonData.skills || ''),
              education: String(jsonData.education || ''),
              currentCompany: String(jsonData.currentCompany || ''),
              linkedinUrl: String(jsonData.linkedinUrl || '')
            }))
          }
          setShowJSONUpload(false)
        } catch (error) {
          alert('Invalid JSON file format')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Candidate Information
        </CardTitle>
        <CardDescription>
          Please provide your details for verification. You can also upload a JSON file with your information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Have your information in JSON format?
              </p>
              {!showJSONUpload ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowJSONUpload(true)}
                >
                  Upload JSON File
                </Button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJSONUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowJSONUpload(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultFields.map((field) => (
                <div key={field.id} className={field.id === 'skills' || field.id === 'address' || field.id === 'education' ? 'md:col-span-2' : ''}>
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={candidateData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={errors[field.id] ? 'border-red-500' : ''}
                    min={field.min}
                    max={field.max}
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Start Verification Process
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sample JSON Format:</h4>
            <pre className="text-xs text-gray-600 overflow-x-auto">
{`{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State 12345",
  "experience": "5",
  "skills": "JavaScript, React, Node.js",
  "education": "BS Computer Science, MIT, 2018",
  "currentCompany": "Tech Corp",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}