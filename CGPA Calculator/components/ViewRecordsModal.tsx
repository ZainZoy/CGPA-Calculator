"use client"

import { useRef } from "react"
import type { User, Course, ActivityLog, Projection } from "@/lib/types"
import { calculateCGPA, formatActivityDescription } from "@/lib/utils"
import html2canvas from "html2canvas"

interface ViewRecordsModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User
  courses: Course[]
  activities: ActivityLog[]
  projections: Projection[]
  isDarkTheme: boolean
}

export function ViewRecordsModal({
  isOpen,
  onClose,
  user,
  courses,
  activities,
  projections,
  isDarkTheme,
}: ViewRecordsModalProps) {
  const recordRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !user) return null

  const { totalQualityPoints, totalCredits, cgpa } = calculateCGPA(courses, user)

  // Helper function to safely format dates
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString()
  }

  // Helper function to safely format date and time
  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleString()
  }

  const handleExportImage = async () => {
    if (recordRef.current) {
      try {
        const canvas = await html2canvas(recordRef.current, {
          backgroundColor: isDarkTheme ? "#1f2937" : "#ffffff",
          scale: 2,
        })

        const link = document.createElement("a")
        link.download = `${user.name}_Academic_Record.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error("Error exporting image:", error)
        alert("Error exporting image. Please try again.")
      }
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ["Course Name", "Credits", "Grade", "Quality Points", "Date Added"],
      ...courses.map((course) => [
        course.name,
        course.credits.toString(),
        course.grade,
        course.qualityPoints.toFixed(1),
        formatDate(course.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const link = document.createElement("a")
    link.download = `${user.name}_Courses.csv`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Academic Records</h2>
          <button
            onClick={onClose}
            className={`${isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div ref={recordRef} className="space-y-6">
          {/* User Info */}
          <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
            <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Major: {user.major}</p>
            <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              Member since: {formatDate(user.createdAt)}
            </p>
            {(user.existingCredits > 0 || user.existingQualityPoints > 0) && (
              <div className="mt-2">
                <p className={`text-sm ${isDarkTheme ? "text-gray-500" : "text-gray-500"}`}>
                  Previous Academic History: {user.existingCredits} credits, {user.existingQualityPoints.toFixed(1)}{" "}
                  quality points
                </p>
              </div>
            )}
          </div>

          {/* CGPA Summary */}
          <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-3">Academic Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Current CGPA</p>
                <p className="text-2xl font-bold text-emerald-400">{cgpa.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Total Credits</p>
                <p className="text-2xl font-bold text-blue-400">{totalCredits}</p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Quality Points</p>
                <p className="text-2xl font-bold text-blue-400">{totalQualityPoints.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Courses ({courses.length})</h3>
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                      <th className="py-2 px-3 font-semibold">Course Name</th>
                      <th className="py-2 px-3 font-semibold">Credits</th>
                      <th className="py-2 px-3 font-semibold">Grade</th>
                      <th className="py-2 px-3 font-semibold">Quality Points</th>
                      <th className="py-2 px-3 font-semibold">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                        <td className="py-2 px-3">{course.name}</td>
                        <td className="py-2 px-3">{course.credits}</td>
                        <td className="py-2 px-3">{course.grade}</td>
                        <td className="py-2 px-3">{course.qualityPoints.toFixed(1)}</td>
                        <td className="py-2 px-3">{formatDate(course.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"} text-center py-4`}>
                No courses added yet.
              </p>
            )}
          </div>

          {/* Projections */}
          {projections.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">CGPA Projections</h3>
              <div className="space-y-2">
                {projections.map((projection) => (
                  <div key={projection.id} className={`${isDarkTheme ? "bg-gray-700/30" : "bg-gray-50"} p-3 rounded`}>
                    <p className="font-medium">
                      Projected CGPA: <span className="text-emerald-400">{projection.projectedCGPA.toFixed(2)}</span>
                    </p>
                    <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                      {projection.semesterCredits} credits with {projection.expectedGPA.toFixed(1)} GPA •{" "}
                      {formatDate(projection.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Activity History</h3>
            {activities.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className={`${isDarkTheme ? "bg-gray-700/30" : "bg-gray-50"} p-3 rounded`}>
                    <p className="text-sm">{formatActivityDescription(activity)}</p>
                    <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-400"}`}>
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"} text-center py-4`}>
                No activity recorded yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-6">
          <button
            onClick={handleExportImage}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <span className="material-icons text-base mr-1">image</span>
            Export as Image
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <span className="material-icons text-base mr-1">download</span>
            Export CSV
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
  )
}
