import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase())
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export const parseSkills = (skillsString: string): string[] => {
  return skillsString
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0)
}

export const calculateOverallScore = (scores: number[]): number => {
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, score) => sum + score, 0)
  return Math.round(total / scores.length)
}

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-yellow-100'
  return 'bg-red-100'
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'error':
      return 'text-red-600'
    case 'loading':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'success':
      return 'bg-green-50'
    case 'warning':
      return 'bg-yellow-50'
    case 'error':
      return 'bg-red-50'
    case 'loading':
      return 'bg-blue-50'
    default:
      return 'bg-gray-50'
  }
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export const downloadAsJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}