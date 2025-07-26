"use client"

import { useState } from "react"
import type { User, Course, Projection } from "@/lib/types"
import { calculateCGPA, calculateProjectedCGPA } from "@/lib/utils"

interface ProjectionModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User
  courses: Course[]
  onSaveProjection: (projection: Omit<Projection, "id">) => void
  isDarkTheme: boolean
}

export function ProjectionModal({
  isOpen,
  onClose,
  user,
  courses,
  onSaveProjection,
  isDarkTheme,
}: ProjectionModalProps) {
  const [semesterCredits, setSemesterCredits] = useState<number>(15)
  const [expectedGPA, setExpectedGPA] = useState<number>(3.5)

  if (!isOpen) return null

  const currentCGPA = calculateCGPA(courses, user)
  const projectedCGPA = calculateProjectedCGPA(courses, user, semesterCredits, expectedGPA)

  const handleSave = () => {
    onSaveProjection({
      userId: user?.id || "",
      semesterCredits,
      expectedGPA,
      projectedCGPA,
      createdAt: new Date(),
      saved: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">CGPA Projection</h2>
          <button
            onClick={onClose}
            className={`${isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
            <h3 className="font-semibold mb-2">Current Status</h3>
            <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              Current CGPA: <span className="font-bold text-blue-400">{currentCGPA.cgpa.toFixed(2)}</span>
            </p>
            <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              Total Credits: <span className="font-bold">{currentCGPA.totalCredits}</span>
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-1`}>
              Credits Enrolled Next Semester
            </label>
            <input
              type="number"
              min="1"
              max="30"
              className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={semesterCredits}
              onChange={(e) => setSemesterCredits(Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-1`}>
              Expected GPA for Next Semester
            </label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.1"
              className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={expectedGPA}
              onChange={(e) => setExpectedGPA(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div
            className={`${isDarkTheme ? "bg-emerald-900/20" : "bg-emerald-100"} p-4 rounded-lg border-l-4 border-emerald-500`}
          >
            <h3 className="font-semibold text-emerald-400 mb-2">Projected Result</h3>
            <p className="text-2xl font-bold text-emerald-400">Projected CGPA: {projectedCGPA.toFixed(2)}</p>
            <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mt-1`}>
              After {semesterCredits} credits with {expectedGPA.toFixed(1)} GPA
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save Projection
            </button>
            <button
              onClick={onClose}
              className={`flex-1 ${isDarkTheme ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} font-semibold py-2 px-4 rounded-lg transition`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
