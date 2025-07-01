'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdditionalAnswers } from '@/types'
import { MessageCircle, Calendar, DollarSign, MapPin, Clock } from 'lucide-react'

interface AdditionalQuestionsProps {
  onComplete: (answers: AdditionalAnswers) => void
}

const questions = [
  {
    id: 'availability',
    label: 'When can you start?',
    placeholder: 'e.g., Immediately, 2 weeks notice, etc.',
    icon: Calendar,
    required: true
  },
  {
    id: 'salaryExpectation',
    label: 'Salary Expectation',
    placeholder: 'e.g., $60,000 - $70,000 per year',
    icon: DollarSign,
    required: true
  },
  {
    id: 'workLocation',
    label: 'Preferred Work Location',
    placeholder: 'e.g., Remote, On-site, Hybrid',
    icon: MapPin,
    required: true
  },
  {
    id: 'workSchedule',
    label: 'Preferred Work Schedule',
    placeholder: 'e.g., Full-time, Part-time, Flexible hours',
    icon: Clock,
    required: true
  },
  {
    id: 'motivation',
    label: 'Why are you interested in this position?',
    placeholder: 'Brief explanation of your interest and motivation',
    icon: MessageCircle,
    required: true
  },
  {
    id: 'additionalInfo',
    label: 'Additional Information (Optional)',
    placeholder: 'Any other relevant information you would like to share',
    icon: MessageCircle,
    required: false
  }
]

export default function AdditionalQuestions({ onComplete }: AdditionalQuestionsProps) {
  const [answers, setAnswers] = useState<AdditionalAnswers>({
    availability: '',
    salaryExpectation: '',
    workLocation: '',
    workSchedule: '',
    motivation: '',
    additionalInfo: ''
  })

  const [errors, setErrors] = useState<Partial<AdditionalAnswers>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleInputChange = (field: keyof AdditionalAnswers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion]
    if (question.required && !answers[question.id as keyof AdditionalAnswers]?.trim()) {
      setErrors(prev => ({
        ...prev,
        [question.id]: 'This field is required'
      }))
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AdditionalAnswers> = {}

    questions.forEach(question => {
      if (question.required && !answers[question.id as keyof AdditionalAnswers]?.trim()) {
        newErrors[question.id as keyof AdditionalAnswers] = 'This field is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(answers)
    } else {
      // Find first error and navigate to that question
      const firstErrorIndex = questions.findIndex(q => 
        errors[q.id as keyof AdditionalAnswers]
      )
      if (firstErrorIndex !== -1) {
        setCurrentQuestion(firstErrorIndex)
      }
    }
  }

  const question = questions[currentQuestion]
  const Icon = question.icon

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Additional Questions
        </CardTitle>
        <CardDescription>
          Please answer the following questions to complete your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Question */}
          <div className="min-h-[200px] flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder={question.placeholder}
                value={answers[question.id as keyof AdditionalAnswers] || ''}
                onChange={(e) => handleInputChange(question.id as keyof AdditionalAnswers, e.target.value)}
                className={`text-center ${errors[question.id as keyof AdditionalAnswers] ? 'border-red-500' : ''}`}
              />
              {errors[question.id as keyof AdditionalAnswers] && (
                <p className="text-red-500 text-sm text-center">
                  {errors[question.id as keyof AdditionalAnswers]}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Complete Questions
              </Button>
            )}
          </div>

          {/* Question Overview */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Progress Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {questions.map((q, index) => {
                const isCompleted = answers[q.id as keyof AdditionalAnswers]?.trim() !== ''
                const isCurrent = index === currentQuestion
                const hasError = errors[q.id as keyof AdditionalAnswers]
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`p-2 text-xs rounded border transition-colors text-left ${
                      isCurrent 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : hasError
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : isCompleted 
                        ? 'border-green-300 bg-green-50 text-green-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted && !hasError ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : hasError ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      )}
                      <span className="truncate">{q.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}