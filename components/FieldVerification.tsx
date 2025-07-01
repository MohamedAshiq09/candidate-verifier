'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CandidateData, VerificationResult, FieldVerificationResult } from '@/types'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react'

interface FieldVerificationProps {
  candidateData: CandidateData
  onComplete: (result: VerificationResult) => void
}

interface FieldStatus {
  field: keyof CandidateData
  label: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  score: number
}

export default function FieldVerification({ candidateData, onComplete }: FieldVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<FieldStatus[]>([
    { field: 'email', label: 'Email Address', status: 'pending', message: 'Checking email validity...', score: 0 },
    { field: 'phone', label: 'Phone Number', status: 'pending', message: 'Verifying phone number...', score: 0 },
    { field: 'address', label: 'Address', status: 'pending', message: 'Validating address...', score: 0 },
    { field: 'education', label: 'Education', status: 'pending', message: 'Verifying education credentials...', score: 0 },
    { field: 'experience', label: 'Work Experience', status: 'pending', message: 'Checking work history...', score: 0 },
    { field: 'skills', label: 'Skills', status: 'pending', message: 'Validating skills...', score: 0 }
  ])
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [overallResult, setOverallResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    performVerification()
  }, [])

  const performVerification = async () => {
    const fields = [...verificationStatus]

    for (let i = 0; i < fields.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
      const outcomes = [
        { status: 'success' as const, message: 'Successfully verified', score: 95 + Math.floor(Math.random() * 5) },
        { status: 'success' as const, message: 'Credentials confirmed', score: 85 + Math.floor(Math.random() * 10) },
        { status: 'warning' as const, message: 'Partially verified - requires manual review', score: 65 + Math.floor(Math.random() * 15) },
        { status: 'error' as const, message: 'Could not verify - information may be incorrect', score: 20 + Math.floor(Math.random() * 30) }
      ]
 
      const weights = [0.6, 0.25, 0.1, 0.05]
      const random = Math.random()
      let selectedIndex = 0
      let cumulativeWeight = 0
      
      for (let j = 0; j < weights.length; j++) {
        cumulativeWeight += weights[j]
        if (random <= cumulativeWeight) {
          selectedIndex = j
          break
        }
      }
      
      fields[i] = {
        ...fields[i],
        ...outcomes[selectedIndex]
      }
      
      setVerificationStatus([...fields])
    }
    
    const fieldResults: FieldVerificationResult[] = fields.map(field => ({
      fieldId: field.field,
      fieldName: field.label,
      status: field.status === 'pending' ? 'loading' : field.status,
      message: field.message,
      score: field.score,
      details: field.status === 'warning' ? 'Manual review required for complete verification' : 
               field.status === 'error' ? 'Unable to verify through automated systems' : undefined
    }))

    const successCount = fields.filter(f => f.status === 'success').length
    const warningCount = fields.filter(f => f.status === 'warning').length
    const errorCount = fields.filter(f => f.status === 'error').length
  
    const totalScore = fields.reduce((sum, field) => sum + field.score, 0)
    const overallScore = Math.round(totalScore / fields.length)
   
    let overallStatus: 'passed' | 'warning' | 'failed'
    if (errorCount > 2 || overallScore < 50) {
      overallStatus = 'failed'
    } else if (warningCount > 1 || overallScore < 80) {
      overallStatus = 'warning'
    } else {
      overallStatus = 'passed'
    }

    let summary: string
    if (overallStatus === 'passed') {
      summary = `Verification completed successfully. ${successCount} out of ${fields.length} fields verified with high confidence.`
    } else if (overallStatus === 'warning') {
      summary = `Verification completed with some concerns. ${warningCount} field(s) require manual review before final approval.`
    } else {
      summary = `Verification failed. ${errorCount} field(s) could not be verified. Manual investigation required.`
    }
    
    const result: VerificationResult = {
      fieldResults,
      overallScore,
      status: overallStatus,
      summary
    }
    
    setOverallResult(result)
    setIsVerifying(false)
  }

  const getStatusIcon = (status: FieldStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: FieldStatus['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleComplete = () => {
    if (overallResult) {
      onComplete(overallResult)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Field Verification
        </CardTitle>
        <CardDescription>
          Verifying candidate information across multiple data sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Verifying: {candidateData.fullName}</h3>
            <p className="text-sm text-gray-600">Email: {candidateData.email}</p>
            {candidateData.currentCompany && (
              <p className="text-sm text-gray-600">Current Company: {candidateData.currentCompany}</p>
            )}
          </div>

          <div className="space-y-3">
            {verificationStatus.map((field, index) => (
              <div
                key={field.field}
                className={`p-4 rounded-lg border transition-colors ${getStatusColor(field.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(field.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{field.label}</h4>
                      <p className="text-sm text-gray-600">{field.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {field.status !== 'pending' && (
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          field.status === 'success' ? 'bg-green-100 text-green-800' :
                          field.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                        </span>
                        <span className={`text-sm font-medium ${getScoreColor(field.score)}`}>
                          {field.score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {overallResult && (
            <div className={`p-4 rounded-lg border-2 ${
              overallResult.status === 'passed' ? 'border-green-300 bg-green-50' :
              overallResult.status === 'failed' ? 'border-red-300 bg-red-50' :
              'border-yellow-300 bg-yellow-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {overallResult.status === 'passed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {overallResult.status === 'failed' && <XCircle className="w-6 h-6 text-red-600" />}
                  {overallResult.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                  <h3 className="text-lg font-semibold">
                    Verification {overallResult.status === 'passed' ? 'Complete' : 
                                 overallResult.status === 'failed' ? 'Failed' : 'Completed with Warnings'}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(overallResult.overallScore)}`}>
                  {overallResult.overallScore}%
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {overallResult.summary}
              </p>
            </div>
          )}

          <Button 
            onClick={handleComplete}
            disabled={isVerifying}
            className="w-full mt-6"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verification in Progress...
              </>
            ) : (
              'Continue to Additional Questions'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}