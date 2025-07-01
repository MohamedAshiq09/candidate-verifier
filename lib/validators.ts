import { CandidateData, VerificationRules } from '@/types'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateLinkedIn = (url: string): boolean => {
  return validateUrl(url) && url.includes('linkedin.com')
}

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name)
}

export const validateSkills = (skills: string, rules: VerificationRules): {
  isValid: boolean
  hasRequired: boolean
  requiredMissing: string[]
  bonusSkills: string[]
} => {
  const skillArray = skills.toLowerCase().split(',').map(s => s.trim())
  const requiredSkills = rules.skills.requiredSkills.map(s => s.toLowerCase())
  const bonusSkills = rules.skills.bonusSkills.map(s => s.toLowerCase())
  
  const hasRequired = requiredSkills.filter(req => 
    skillArray.some(skill => skill.includes(req))
  )
  
  const requiredMissing = requiredSkills.filter(req => 
    !skillArray.some(skill => skill.includes(req))
  )
  
  const foundBonusSkills = bonusSkills.filter(bonus => 
    skillArray.some(skill => skill.includes(bonus))
  )
  
  return {
    isValid: skillArray.length > 0,
    hasRequired: requiredMissing.length === 0,
    requiredMissing,
    bonusSkills: foundBonusSkills
  }
}

export const validateExperience = (experience: number, rules: VerificationRules): {
  isValid: boolean
  meetsMinimum: boolean
} => {
  return {
    isValid: experience >= 0 && experience <= 50,
    meetsMinimum: experience >= rules.experience.minimumYears
  }
}

export const validateEmailDomain = (email: string, rules: VerificationRules): {
  isValid: boolean
  isAllowed: boolean
  domain: string
} => {
  const domain = email.split('@')[1]?.toLowerCase()
  const isAllowed = rules.email.allowedDomains.includes(domain)
  
  return {
    isValid: !!domain,
    isAllowed,
    domain: domain || ''
  }
}

export const validateCandidateData = (data: CandidateData): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (!validateName(data.fullName)) {
    errors.push('Full name must be at least 2 characters and contain only letters')
  }
  
  if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address')
  }
  
  if (!validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number')
  }
  
  const experienceNum = typeof data.experience === 'number' ? data.experience : Number(data.experience)
  if (isNaN(experienceNum) || experienceNum < 0 || experienceNum > 50) {
    errors.push('Experience must be between 0 and 50 years')
  }
  
  if (!data.skills || data.skills.trim().length < 3) {
    errors.push('Please enter at least 3 characters for skills')
  }
  
  if (!data.education) {
    errors.push('Please select your education level')
  }
  
  if (data.linkedinUrl && !validateLinkedIn(data.linkedinUrl)) {
    errors.push('Please enter a valid LinkedIn URL')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const calculateFieldScore = (
  fieldId: string, 
  value: any, 
  rules: VerificationRules
): number => {
  switch (fieldId) {
    case 'email':
      const emailValid = validateEmail(value)
      const domainCheck = validateEmailDomain(value, rules)
      if (!emailValid) return 0
      if (!domainCheck.isAllowed) return 60
      return 100
      
    case 'skills':
      const skillsCheck = validateSkills(value, rules)
      if (!skillsCheck.isValid) return 0
      if (!skillsCheck.hasRequired) return 40
      const bonusPoints = skillsCheck.bonusSkills.length * 10
      return Math.min(100, 80 + bonusPoints)
      
    case 'experience':
      const expCheck = validateExperience(value, rules)
      if (!expCheck.isValid) return 0
      if (!expCheck.meetsMinimum) return 50
      return Math.min(100, 70 + (value * 2))
      
    case 'phone':
      return validatePhone(value) ? 100 : 0
      
    case 'fullName':
      return validateName(value) ? 100 : 0
      
    case 'linkedinUrl':
      if (!value) return 80 // Optional field
      return validateLinkedIn(value) ? 100 : 0
      
    case 'education':
      const educationScores: { [key: string]: number } = {
        'High School': 60,
        'Bootcamp/Certification': 70,
        "Bachelor's Degree": 80,
        "Master's Degree": 90,
        'PhD': 100
      }
      return educationScores[value] || 60
      
    default:
      return value ? 100 : 0
  }
}