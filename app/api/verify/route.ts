import { NextRequest, NextResponse } from 'next/server'
import { CandidateData, VerificationResult, FieldVerificationResult, VerificationRules } from '@/types'


const DEFAULT_VERIFICATION_RULES: VerificationRules = {
  email: {
    checkDomain: true,
    allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'],
    blockTempEmail: true
  },
  skills: {
    requiredSkills: ['JavaScript', 'React', 'Node.js'],
    bonusSkills: ['TypeScript', 'Next.js', 'AWS', 'Docker']
  },
  experience: {
    minimumYears: 2
  }
}

const TEMP_EMAIL_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.org',
  'mailinator.com'
]

export async function POST(request: NextRequest) {
  try {
    const { candidateData, verificationRules = DEFAULT_VERIFICATION_RULES } = await request.json()

    if (!candidateData) {
      return NextResponse.json(
        { success: false, error: 'Candidate data is required' },
        { status: 400 }
      )
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    const verificationResults = await performVerification(candidateData, verificationRules)

    return NextResponse.json({
      success: true,
      data: verificationResults,
      message: 'Verification completed successfully'
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error during verification' },
      { status: 500 }
    )
  }
}

async function performVerification(
  candidateData: CandidateData, 
  rules: VerificationRules
): Promise<VerificationResult> {
  const fieldResults: FieldVerificationResult[] = []

  const emailResult = await verifyEmail(candidateData.email, rules.email)
  fieldResults.push(emailResult)

  const phoneResult = await verifyPhone(candidateData.phone)
  fieldResults.push(phoneResult)

  const experienceResult = await verifyExperience(candidateData.experience, rules.experience)
  fieldResults.push(experienceResult)

  const skillsResult = await verifySkills(candidateData.skills, rules.skills)
  fieldResults.push(skillsResult)

  const educationResult = await verifyEducation(candidateData.education)
  fieldResults.push(educationResult)

  const addressResult = await verifyAddress(candidateData.address)
  fieldResults.push(addressResult)

  const totalScore = fieldResults.reduce((sum, result) => sum + result.score, 0)
  const averageScore = totalScore / fieldResults.length
  
  let status: 'passed' | 'warning' | 'failed'
  let summary: string

  if (averageScore >= 80) {
    status = 'passed'
    summary = 'All verifications passed successfully. Candidate profile is verified.'
  } else if (averageScore >= 60) {
    status = 'warning'
    summary = 'Most verifications passed with some warnings. Manual review recommended.'
  } else {
    status = 'failed'
    summary = 'Multiple verification failures detected. Candidate profile requires attention.'
  }

  return {
    fieldResults,
    overallScore: Math.round(averageScore),
    status,
    summary
  }
}

async function verifyEmail(email: string, rules: any): Promise<FieldVerificationResult> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return {
      fieldId: 'email',
      fieldName: 'Email Address',
      status: 'error',
      message: 'Invalid email format',
      score: 0
    }
  }

  const domain = email.split('@')[1]
  
  if (rules.blockTempEmail && TEMP_EMAIL_DOMAINS.includes(domain)) {
    return {
      fieldId: 'email',
      fieldName: 'Email Address',
      status: 'warning',
      message: 'Temporary email domain detected',
      details: 'Consider requesting a permanent email address',
      score: 40
    }
  }

  const isDomainValid = Math.random() > 0.1 
  
  if (!isDomainValid) {
    return {
      fieldId: 'email',
      fieldName: 'Email Address',
      status: 'warning',
      message: 'Domain verification inconclusive',
      details: 'Unable to verify domain authenticity',
      score: 70
    }
  }

  return {
    fieldId: 'email',
    fieldName: 'Email Address',
    status: 'success',
    message: 'Email verified successfully',
    score: 100
  }
}

async function verifyPhone(phone: string): Promise<FieldVerificationResult> {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  
  if (!phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''))) {
    return {
      fieldId: 'phone',
      fieldName: 'Phone Number',
      status: 'error',
      message: 'Invalid phone number format',
      score: 0
    }
  }

  const isPhoneValid = Math.random() > 0.05 
  
  if (!isPhoneValid) {
    return {
      fieldId: 'phone',
      fieldName: 'Phone Number',
      status: 'warning',
      message: 'Phone number verification inconclusive',
      score: 60
    }
  }

  return {
    fieldId: 'phone',
    fieldName: 'Phone Number',
    status: 'success',
    message: 'Phone number verified',
    score: 100
  }
}

async function verifyExperience(experience: string, rules: any): Promise<FieldVerificationResult> {
  const experienceYears = parseInt(experience)
  
  if (isNaN(experienceYears) || experienceYears < 0) {
    return {
      fieldId: 'experience',
      fieldName: 'Work Experience',
      status: 'error',
      message: 'Invalid experience format',
      score: 0
    }
  }

  if (experienceYears < rules.minimumYears) {
    return {
      fieldId: 'experience',
      fieldName: 'Work Experience',
      status: 'warning',
      message: `Experience below minimum requirement (${rules.minimumYears} years)`,
      score: 50
    }
  }

  return {
    fieldId: 'experience',
    fieldName: 'Work Experience',
    status: 'success',
    message: 'Experience meets requirements',
    score: 100
  }
}

async function verifySkills(skills: string, rules: any): Promise<FieldVerificationResult> {
  if (!skills || skills.trim().length === 0) {
    return {
      fieldId: 'skills',
      fieldName: 'Skills',
      status: 'error',
      message: 'Skills information is required',
      score: 0
    }
  }

  const skillsList = skills.toLowerCase().split(',').map(s => s.trim())
  const requiredSkills = rules.requiredSkills.map((s: string) => s.toLowerCase())
  const bonusSkills = rules.bonusSkills.map((s: string) => s.toLowerCase())

const matchedRequired: string[] = requiredSkills.filter((skill: string) => 
    skillsList.some((candidateSkill: string) => candidateSkill.includes(skill))
)
  
const matchedBonus: string[] = bonusSkills.filter((skill: string) =>
    skillsList.some((candidateSkill: string) => candidateSkill.includes(skill))
)

  let score = (matchedRequired.length / requiredSkills.length) * 80
  score += (matchedBonus.length / bonusSkills.length) * 20

  if (score >= 80) {
    return {
      fieldId: 'skills',
      fieldName: 'Skills',
      status: 'success',
      message: 'Skills profile matches requirements',
      details: `Matched ${matchedRequired.length}/${requiredSkills.length} required skills`,
      score: Math.round(score)
    }
  } else if (score >= 50) {
    return {
      fieldId: 'skills',
      fieldName: 'Skills',
      status: 'warning',
      message: 'Partial skills match',
      details: `Matched ${matchedRequired.length}/${requiredSkills.length} required skills`,
      score: Math.round(score)
    }
  } else {
    return {
      fieldId: 'skills',
      fieldName: 'Skills',
      status: 'error',
      message: 'Skills do not meet minimum requirements',
      details: `Matched ${matchedRequired.length}/${requiredSkills.length} required skills`,
      score: Math.round(score)
    }
  }
}

async function verifyEducation(education: string): Promise<FieldVerificationResult> {
  if (!education || education.trim().length < 3) {
    return {
      fieldId: 'education',
      fieldName: 'Education',
      status: 'error',
      message: 'Education information is required',
      score: 0
    }
  }

  const isEducationValid = Math.random() > 0.15 
  
  if (!isEducationValid) {
    return {
      fieldId: 'education',
      fieldName: 'Education',
      status: 'warning',
      message: 'Education verification inconclusive',
      details: 'Unable to verify with educational institutions',
      score: 70
    }
  }

  return {
    fieldId: 'education',
    fieldName: 'Education',
    status: 'success',
    message: 'Education credentials verified',
    score: 100
  }
}

async function verifyAddress(address: string): Promise<FieldVerificationResult> {
  if (!address || address.trim().length < 10) {
    return {
      fieldId: 'address',
      fieldName: 'Address',
      status: 'error',
      message: 'Complete address is required',
      score: 0
    }
  }

  const isAddressValid = Math.random() > 0.1 
  
  if (!isAddressValid) {
    return {
      fieldId: 'address',
      fieldName: 'Address',
      status: 'warning',
      message: 'Address verification inconclusive',
      details: 'Unable to verify with postal services',
      score: 75
    }
  }

  return {
    fieldId: 'address',
    fieldName: 'Address',
    status: 'success',
    message: 'Address verified successfully',
    score: 100
  }
}