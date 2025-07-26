import type { Course, CGPAData, User, ActivityLog } from "./types"

export const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
}

export function calculateCGPA(courses: Course[], user?: User): CGPAData {
  const courseCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const courseQualityPoints = courses.reduce((sum, course) => sum + course.qualityPoints, 0)

  const existingCredits = user?.existingCredits || 0
  const existingQualityPoints = user?.existingQualityPoints || 0

  const totalCredits = courseCredits + existingCredits
  const totalQualityPoints = courseQualityPoints + existingQualityPoints
  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0

  return {
    totalQualityPoints,
    totalCredits,
    cgpa: Math.round(cgpa * 100) / 100,
  }
}

export function calculateProjectedCGPA(
  courses: Course[],
  user: User | undefined,
  semesterCredits: number,
  expectedGPA: number,
): number {
  const current = calculateCGPA(courses, user)
  const projectedQualityPoints = semesterCredits * expectedGPA
  const totalQualityPoints = current.totalQualityPoints + projectedQualityPoints
  const totalCredits = current.totalCredits + semesterCredits

  return totalCredits > 0 ? Math.round((totalQualityPoints / totalCredits) * 100) / 100 : 0
}

export function calculateQualityPoints(credits: number, grade: string): number {
  const gradePoint = GRADE_POINTS[grade] || 0
  return credits * gradePoint
}

export function getGradeColor(grade: string): string {
  const gradeColors: Record<string, string> = {
    "A+": "bg-green-500/20 text-green-300",
    A: "bg-green-500/20 text-green-300",
    "A-": "bg-teal-500/20 text-teal-300",
    "B+": "bg-yellow-500/20 text-yellow-300",
    B: "bg-yellow-500/20 text-yellow-300",
    "B-": "bg-orange-500/20 text-orange-300",
    "C+": "bg-orange-500/20 text-orange-300",
    C: "bg-red-500/20 text-red-300",
    "C-": "bg-red-500/20 text-red-300",
    "D+": "bg-red-600/20 text-red-400",
    D: "bg-red-600/20 text-red-400",
    F: "bg-red-700/20 text-red-500",
  }
  return gradeColors[grade] || "bg-gray-500/20 text-gray-300"
}

export function formatActivityDescription(activity: ActivityLog): string {
  switch (activity.type) {
    case "course_added":
      return `Added course: ${activity.newValue?.name} (${activity.newValue?.credits} credits, Grade: ${activity.newValue?.grade})`
    case "course_updated":
      return `Updated course: ${activity.newValue?.name}`
    case "course_deleted":
      return `Deleted course: ${activity.oldValue?.name}`
    case "projection_created":
      return `Created projection: ${activity.newValue?.semesterCredits} credits with ${activity.newValue?.expectedGPA} GPA`
    case "user_created":
      return `Created user: ${activity.newValue?.name} (${activity.newValue?.major})`
    default:
      return activity.description
  }
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
