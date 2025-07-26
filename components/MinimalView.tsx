"use client"

import { useState } from "react"
import type { Course } from "@/lib/types"
import { calculateCGPA, getGradeColor, calculateQualityPoints, GRADE_POINTS } from "@/lib/utils"
import type { User } from "next-auth/types"

interface MinimalViewProps {
  courses: Course[]
  user?: User
  addCourse: (course: Omit<Course, "id">) => void
  deleteCourse: (id: string) => void
  isDarkTheme: boolean
}

export function MinimalView({ courses, user, addCourse, deleteCourse, isDarkTheme }: MinimalViewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCourse, setNewCourse] = useState({
    name: "",
    credits: 3,
    grade: "A",
  })

  const { cgpa } = calculateCGPA(courses, user)

  const handleAddCourse = () => {
    if (newCourse.name) {
      const qualityPoints = calculateQualityPoints(newCourse.credits, newCourse.grade)
      addCourse({
        name: newCourse.name,
        credits: newCourse.credits,
        grade: newCourse.grade,
        qualityPoints,
        userId: "",
        createdAt: new Date(),
      })
      setNewCourse({ name: "", credits: 3, grade: "A" })
      setShowAddForm(false)
    }
  }

  return (
    <div className="minimal-view text-center p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <div className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-8 rounded-lg shadow-2xl max-w-md w-full`}>
        <p className={`text-lg ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Current CGPA</p>
        <p className="text-7xl font-bold text-emerald-400 my-4 glowing-text-green">{cgpa.toFixed(2)}</p>

        {showAddForm ? (
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Course Name"
              className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />

            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Credits"
                min="1"
                max="6"
                className={`flex-1 ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 1 })}
              />

              <select
                className={`flex-1 ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newCourse.grade}
                onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
              >
                {Object.keys(GRADE_POINTS).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddCourse}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Add Course
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 ${isDarkTheme ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} font-semibold py-2 px-4 rounded-lg transition`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition text-lg mb-6"
          >
            <span className="material-icons text-xl mr-2">add</span>
            Add Course
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                <th className="py-2 px-3 font-semibold">Course Name</th>
                <th className="py-2 px-3 font-semibold">Grade</th>
                <th className="py-2 px-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="py-3 px-3">{course.name}</td>
                  <td className="py-3 px-3">
                    <span className={`${getGradeColor(course.grade)} text-xs font-bold px-2 py-0.5 rounded-full`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className={`${isDarkTheme ? "text-gray-500 hover:text-red-500" : "text-gray-400 hover:text-red-500"}`}
                      title="Delete"
                    >
                      <span className="material-icons text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {courses.length === 0 && (
            <div className="text-center py-4">
              <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"} text-sm`}>No courses added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
