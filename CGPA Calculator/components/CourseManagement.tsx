"use client"

import { useState } from "react"
import type { Course } from "@/lib/types"
import { getGradeColor, calculateQualityPoints, GRADE_POINTS } from "@/lib/utils"

interface CourseManagementProps {
  courses: Course[]
  addCourse: (course: Omit<Course, "id">) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  isDarkTheme: boolean
  onShowProjection: () => void
}

export function CourseManagement({
  courses,
  addCourse,
  updateCourse,
  deleteCourse,
  isDarkTheme,
  onShowProjection,
}: CourseManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState({
    name: "",
    credits: 3,
    grade: "A",
  })
  const [showProjectionModal, setShowProjectionModal] = useState(false)

  const handleAddCourse = () => {
    if (newCourse.name) {
      const qualityPoints = calculateQualityPoints(newCourse.credits, newCourse.grade)
      addCourse({
        name: newCourse.name,
        credits: newCourse.credits,
        grade: newCourse.grade,
        qualityPoints,
        userId: "", // Will be set in parent component
        createdAt: new Date(),
      })
      setNewCourse({ name: "", credits: 3, grade: "A" })
      setShowAddForm(false)
    }
  }

  const handleUpdateCourse = (course: Course, updates: Partial<Course>) => {
    const updatedCourse = { ...course, ...updates }
    if (updates.credits !== undefined || updates.grade !== undefined) {
      updatedCourse.qualityPoints = calculateQualityPoints(updatedCourse.credits, updatedCourse.grade)
    }
    updateCourse(course.id, updatedCourse)
    setEditingCourse(null)
  }

  return (
    <div
      className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}
      data-section="course-management"
    >
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Course Management</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <span className="material-icons text-base mr-1">{showAddForm ? "close" : "add"}</span>
            {showAddForm ? "Cancel" : "Add Course"}
          </button>
          <button
            onClick={onShowProjection}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <span className="material-icons text-base mr-1">trending_up</span>
            Projection
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Course Name"
              className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />

            <input
              type="number"
              placeholder="Credits"
              min="1"
              max="6"
              className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 1 })}
            />

            <select
              className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

          <button
            onClick={handleAddCourse}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Add Course
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
              <th className="py-3 px-4 font-semibold">Course Name</th>
              <th className="py-3 px-4 font-semibold">Credits</th>
              <th className="py-3 px-4 font-semibold">Grade</th>
              <th className="py-3 px-4 font-semibold">Quality Points</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                <td className="py-4 px-4">
                  {editingCourse === course.id ? (
                    <input
                      type="text"
                      className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded py-1 px-2 text-sm`}
                      defaultValue={course.name}
                      onBlur={(e) => handleUpdateCourse(course, { name: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateCourse(course, { name: e.currentTarget.value })
                        }
                      }}
                    />
                  ) : (
                    course.name
                  )}
                </td>
                <td className="py-4 px-4">
                  {editingCourse === course.id ? (
                    <input
                      type="number"
                      min="1"
                      max="6"
                      className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded py-1 px-2 text-sm w-16`}
                      defaultValue={course.credits}
                      onBlur={(e) => handleUpdateCourse(course, { credits: Number.parseInt(e.target.value) || 1 })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateCourse(course, { credits: Number.parseInt(e.currentTarget.value) || 1 })
                        }
                      }}
                    />
                  ) : (
                    course.credits
                  )}
                </td>
                <td className="py-4 px-4">
                  {editingCourse === course.id ? (
                    <select
                      className={`${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded py-1 px-2 text-sm`}
                      defaultValue={course.grade}
                      onChange={(e) => handleUpdateCourse(course, { grade: e.target.value })}
                    >
                      {Object.keys(GRADE_POINTS).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`${getGradeColor(course.grade)} text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full`}
                    >
                      {course.grade}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">{course.qualityPoints.toFixed(1)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingCourse(editingCourse === course.id ? null : course.id)}
                      className={`${isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                      title="Edit"
                    >
                      <span className="material-icons">{editingCourse === course.id ? "check" : "edit"}</span>
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className={`${isDarkTheme ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500"}`}
                      title="Delete"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              No courses added yet. Click "Add Course" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
