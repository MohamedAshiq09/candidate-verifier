// src/components/Summary.tsx
'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CandidateData, VerificationResult, AdditionalAnswers, APIResponse, SavedApplication } from '@/types'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Save, 
  RotateCcw, 
  User, 
  Shield, 
  MessageSquare,
  Loader2,
  Calendar,
  CheckCircle2
} from 'lucide-react'

interface SummaryProps {
  candidateData: CandidateData
  verificationResult: VerificationResult
  additionalAnswers: AdditionalAnswers
  onRestart: () => void
}

export default function Summary({ 
  candidateData, 
  verificationResult, 
  additionalAnswers, 
  onRestart 
}: SummaryProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [savedApplicationId, setSavedApplicationId] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getOverallStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-500" />
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simulate API call to save application
      const applicationData: SavedApplication = {
        id: `app_${Date.now()}`,
        candidateData,
        verificationResult,
        additionalAnswers,
        timestamp: new Date().toISOString(),
        status: verificationResult.status
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful save
      setSavedApplicationId(applicationData.id)
      setSaveSuccess(true)
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Error saving application:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadReport = () => {
    const reportData = {
      candidate: candidateData,
      verification: verificationResult,
      additionalAnswers,
      generatedAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `verification_report_${candidateData.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card className={`border-2 ${getStatusColor(verificationResult.status)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getOverallStatusIcon(verificationResult.status)}
              <div>
                <CardTitle className="text-2xl">
                  Verification {verificationResult.status === 'passed' ? 'Completed' : 
                    verificationResult.status === 'failed' ? 'Failed' : 'Completed with Warnings'}
                </CardTitle>
                <CardDescription className="text-lg">
                  Overall Score: <span className={`font-bold ${getScoreColor(verificationResult.overallScore)}`}>
                    {verificationResult.overallScore}%
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${getScoreBgColor(verificationResult.overallScore)}`}>
              <span className={`font-bold ${getScoreColor(verificationResult.overallScore)}`}>
                {verificationResult.overallScore}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg">{verificationResult.summary}</p>
        </CardContent>
      </Card>

      {/* Candidate Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Candidate Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Personal Details</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {candidateData.fullName}</p>
                <p><span className="font-medium">Email:</span> {candidateData.email}</p>
                <p><span className="font-medium">Phone:</span> {candidateData.phone}</p>
                <p><span className="font-medium">Address:</span> {candidateData.address}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Professional Details</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Experience:</span> {candidateData.experience}</p>
                <p><span className="font-medium">Education:</span> {candidateData.education}</p>
                {candidateData.currentCompany && (
                  <p><span className="font-medium">Current Company:</span> {candidateData.currentCompany}</p>
                )}
                {candidateData.linkedinUrl && (
                  <p><span className="font-medium">LinkedIn:</span> 
                    <a href={candidateData.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline ml-1">
                      View Profile
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
            <p className="text-gray-600">{candidateData.skills}</p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Verification Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationResult.fieldResults.map((result, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-semibold text-gray-800">{result.fieldName}</h4>
                      <p className="text-gray-600 mt-1">{result.message}</p>
                      {result.details && (
                        <p className="text-sm text-gray-500 mt-2">{result.details}</p>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(result.score)}`}>
                    <span className={getScoreColor(result.score)}>{result.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(additionalAnswers).map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h4 className="font-semibold text-gray-700 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleSave}
          disabled={isSaving || saveSuccess}
          size="lg"
          className="flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Application</span>
            </>
          )}
        </Button>

        <Button 
          onClick={handleDownloadReport}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Report</span>
        </Button>

        <Button 
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Verification</span>
        </Button>
      </div>

      {/* Save Success Message */}
      {saveSuccess && savedApplicationId && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Application Saved Successfully!</p>
                <p className="text-green-700 text-sm">
                  Application ID: <span className="font-mono">{savedApplicationId}</span>
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Generated on: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}