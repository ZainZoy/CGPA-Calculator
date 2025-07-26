export interface User {
  id: string
  name: string
  major: string
  existingQualityPoints: number
  existingCredits: number
  createdAt: Date
}

export interface Course {
  id: string
  userId: string
  name: string
  credits: number
  grade: string
  qualityPoints: number
  createdAt: Date
}

export interface CGPAData {
  totalQualityPoints: number
  totalCredits: number
  cgpa: number
}

export interface Projection {
  id: string
  userId: string
  semesterCredits: number
  expectedGPA: number
  projectedCGPA: number
  createdAt: Date
  saved: boolean
}

export interface ActivityLog {
  id: string
  userId: string
  type: "course_added" | "course_updated" | "course_deleted" | "projection_created" | "user_created"
  description: string
  oldValue?: any
  newValue?: any
  timestamp: Date
}
