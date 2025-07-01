// src/app/api/save/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { CandidateData, VerificationResult, AdditionalAnswers, SavedApplication } from '@/types'

// In-memory storage for demo purposes
// In production, this would be a database
const applications: SavedApplication[] = []

export async function POST(request: NextRequest) {
  try {
    const { candidateData, verificationResult, additionalAnswers } = await request.json()

    if (!candidateData || !verificationResult || !additionalAnswers) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Generate unique ID
    const id = generateUniqueId()

    // Create saved application
    const savedApplication: SavedApplication = {
      id,
      candidateData,
      verificationResult,
      additionalAnswers,
      timestamp: new Date().toISOString(),
      status: verificationResult.status
    }

    // Save to storage (in-memory for demo)
    applications.push(savedApplication)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      data: {
        applicationId: id,
        savedApplication
      },
      message: 'Application saved successfully'
    })

  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error while saving' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific application
      const application = applications.find(app => app.id === id)
      
      if (!application) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: application
      })
    } else {
      // Get all applications
      return NextResponse.json({
        success: true,
        data: applications.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      })
    }

  } catch (error) {
    console.error('Retrieve error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving' },
      { status: 500 }
    )
  }
}

function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}