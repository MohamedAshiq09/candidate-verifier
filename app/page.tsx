'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import CandidateVerifier from '@/components/CandidateVerifier'
import FieldVerification from '@/components/FieldVerification'
import AdditionalQuestions from '@/components/AdditionalQuestions'
import Summary from '@/components/Summary'
import { CandidateData, VerificationResult, AdditionalAnswers } from '@/types'
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react'

const STEPS = [
  { id: 'input', title: 'Candidate Information', icon: FileText },
  { id: 'verification', title: 'Verification', icon: AlertCircle },
  { id: 'questions', title: 'Additional Questions', icon: Clock },
  { id: 'summary', title: 'Summary', icon: CheckCircle }
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [additionalAnswers, setAdditionalAnswers] = useState<AdditionalAnswers | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleCandidateSubmit = async (data: CandidateData) => {
    setIsLoading(true)
    setCandidateData(data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setCurrentStep(1)
    setIsLoading(false)
  }

  const handleVerificationComplete = (result: VerificationResult) => {
    setVerificationResult(result)
    setCurrentStep(2)
  }

  const handleQuestionsComplete = (answers: AdditionalAnswers) => {
    setAdditionalAnswers(answers)
    setCurrentStep(3)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCandidateData(null)
    setVerificationResult(null)
    setAdditionalAnswers(null)
  }

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CandidateVerifier 
            onSubmit={handleCandidateSubmit}
            isLoading={isLoading}
          />
        )
      case 1:
        return (
          <FieldVerification
            candidateData={candidateData!}
            onComplete={handleVerificationComplete}
          />
        )
      case 2:
        return (
          <AdditionalQuestions
            onComplete={handleQuestionsComplete}
          />
        )
      case 3:
        return (
          <Summary
            candidateData={candidateData!}
            verificationResult={verificationResult!}
            additionalAnswers={additionalAnswers!}
            onRestart={handleRestart}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Candidate Verification System
          </h1>
          <p className="text-gray-600 text-lg">
            Complete verification process for recruitment
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {STEPS.length}
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="transition-all duration-300 ease-in-out">
          {getCurrentStepComponent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Candidate Verification System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}